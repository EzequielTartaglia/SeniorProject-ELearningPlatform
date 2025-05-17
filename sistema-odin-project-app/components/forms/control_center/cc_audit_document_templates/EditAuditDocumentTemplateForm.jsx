"use client";

import {
  getAuditDocumentTemplate,
  editAuditDocumentTemplate,
} from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";

export default function EditAuditDocumentTemplateForm({ auditDocumentId }) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [auditDocumentTemplate, setAuditDocumentTemplate] = useState({
    title: "",
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const templateData = await getAuditDocumentTemplate(auditDocumentId);
        setAuditDocumentTemplate(templateData);
      } catch (error) {
        console.error("Error al obtener la plantilla:", error);
      }
    };

    if (auditDocumentId) {
      fetchTemplateData();
    }
  }, [auditDocumentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !auditDocumentTemplate.title ||
      !userControlCenter.cc_user_business_id
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await editAuditDocumentTemplate(
        auditDocumentId,
        auditDocumentTemplate.title,
        auditDocumentTemplate.description
      );

      showNotification(
        "¡Plantilla de legajo para auditorías actualizada exitosamente!",
        "success"
      );

      setTimeout(() => {
        router.push(
          `/control_center/admin/audit_document_templates/${auditDocumentId}`
        );
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Error al intentar actualizar la plantilla:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditDocumentTemplate({ ...auditDocumentTemplate, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Editar plantilla de legajo para auditorías"
        goBackRoute={`/control_center/admin/audit_document_templates/${auditDocumentId}`}
        goBackText="Volver a la informacion general de la plantilla"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Titulo del documento"
          name="title"
          value={auditDocumentTemplate.title}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            auditDocumentTemplate.title.trim() === "" && isSubmitted
              ? "Campo obligatorio"
              : ""
          }
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={auditDocumentTemplate.description}
          placeholder="Escribe aquí..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Actualizar plantilla de legajo
        </SubmitLoadingButton>
      </form>
    </>
  );
}
