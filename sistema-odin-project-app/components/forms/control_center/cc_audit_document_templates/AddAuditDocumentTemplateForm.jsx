"use client";

import { addAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";

export default function AddAuditDocumentTemplateForm() {
  const { userControlCenter } = useUserControlCenterInfo();

  const [auditDocumentTemplate, setAuditdocumentTemplate] = useState({
    title: "",
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

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
      const newTemplates = await addAuditDocumentTemplate(
        auditDocumentTemplate.title,
        auditDocumentTemplate.description,
        userControlCenter.cc_user_business_id
      );

      if (!newTemplates || newTemplates.length === 0) {
        throw new Error("No se pudo obtener el ID de la nueva plantilla.");
      }

      const newTemplate = newTemplates[0]; 

      showNotification(
        "¡Plantilla de legajo para auditorías añadida al sistema exitosamente!",
        "success"
      );

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/admin/audit_document_templates/${newTemplate.id}`);
      }, 2000);
    } catch (error) {
      console.error(
        "Error trying to add the document template:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditdocumentTemplate({ ...auditDocumentTemplate, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nueva plantilla de legajo para auditorías"
        goBackRoute="/control_center/admin/audit_document_templates"
        goBackText="Volver al listado de plantillas de legajo para auditorías"
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
          placeholder="Escribe aqui..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Crear plantilla de legajo
        </SubmitLoadingButton>
      </form>
    </>
  );
}
