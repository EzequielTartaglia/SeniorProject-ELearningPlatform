"use client";

import { addAuditDocumentTemplateSection } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";

export default function AddAuditDocumentTemplateSectionForm({
  auditDocumentId,
}) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [auditDocumentTemplateSection, setAuditDocumentTemplateSection] =
    useState({
      name: "",
      description: "",
      cc_audit_document_template_id: auditDocumentId,
    });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !auditDocumentTemplateSection.name ||
      !auditDocumentTemplateSection.cc_audit_document_template_id
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await addAuditDocumentTemplateSection(
        auditDocumentTemplateSection.name,
        auditDocumentTemplateSection.description,
        auditDocumentTemplateSection.cc_audit_document_template_id
      );

      showNotification(
        "¡Seccion de auditoria añadida exitosamente!",
        "success"
      );

      setTimeout(() => {
        setIsLoading(false);
        router.push(
          `/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections`
        );
      }, 2000);
    } catch (error) {
      console.error(
        "Error trying to add the document template section:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditDocumentTemplateSection({
      ...auditDocumentTemplateSection,
      [name]: value,
    });
  };

  return (
    <>
      <PageHeader
        title="Nueva seccion de auditoria"
        goBackRoute={`/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections`}
        goBackText="Volver al listado de secciones"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Seccion"
          name="name"
          value={auditDocumentTemplateSection.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            auditDocumentTemplateSection.name.trim() === "" && isSubmitted
              ? "Campo obligatorio"
              : ""
          }
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={auditDocumentTemplateSection.description}
          placeholder="Escribe aqui..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar seccion
        </SubmitLoadingButton>
      </form>
    </>
  );
}
