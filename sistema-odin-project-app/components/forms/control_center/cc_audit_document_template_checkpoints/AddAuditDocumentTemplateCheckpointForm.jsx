"use client";

import { addAuditDocumentTemplateCheckpoint } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { getAuditDocumentTemplateCheckpointTypes } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint_type/cc_audit_document_template_checkpoint_type";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import TextArea from "@/components/forms/TextArea";
import SelectInput from "@/components/forms/SelectInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddAuditDocumentTemplateCheckpointForm({
  auditDocumentId,
}) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [typesTable, setTypesTable] = useState([]);
  const [sectionsTable, setSectionsTable] = useState([]);

  const [auditDocumentTemplateCheckpoint, setAuditdocumentTemplateCheckpoint] =
    useState({
      title: "",
      description: "",
      cc_audit_document_template_checkpoint_type_id: null,
      cc_audit_document_template_section_id: null,
    });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const typesTable = await getAuditDocumentTemplateCheckpointTypes();
        setTypesTable(typesTable);

        const sectionsTable =
          await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
            auditDocumentId
          );
        setSectionsTable(sectionsTable);
      } catch (error) {
        console.error(
          "Error al obtener datos de las tablas de checkpoint_types:",
          error.message
        );
      }
    }
    fetchData();
  }, [auditDocumentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !auditDocumentTemplateCheckpoint.title ||
      !auditDocumentTemplateCheckpoint.cc_audit_document_template_section_id ||
      !userControlCenter.cc_user_business_id
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await addAuditDocumentTemplateCheckpoint(
        auditDocumentTemplateCheckpoint.title,
        auditDocumentTemplateCheckpoint.description,
        auditDocumentId,
        auditDocumentTemplateCheckpoint.cc_audit_document_template_checkpoint_type_id,
        auditDocumentTemplateCheckpoint.cc_audit_document_template_section_id
      );

      showNotification("¡Punto de auditoria añadido exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(
          `/control_center/admin/audit_document_templates/${auditDocumentId}`
        );
      }, 2000);
    } catch (error) {
      console.error(
        "Error trying to add the document template checkpoint:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditdocumentTemplateCheckpoint({
      ...auditDocumentTemplateCheckpoint,
      [name]: value,
    });
  };

  return (
    <>
      <PageHeader
        title="Nuevo punto de auditoria"
        goBackRoute={`/control_center/admin/audit_document_templates/${auditDocumentId}`}
        goBackText="Volver a la plantilla de legajo de auditoria"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <SelectInput
          label="Seccion"
          name="cc_audit_document_template_section_id"
          value={
            auditDocumentTemplateCheckpoint.cc_audit_document_template_section_id
          }
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={sectionsTable}
          columnName="name"
          idColumn="id"
          hasAdd={true}
          onAddRedirect={() => router.push(`/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections/new`)}
        />

        <Input
          label="Titulo"
          name="title"
          value={auditDocumentTemplateCheckpoint.title}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            auditDocumentTemplateCheckpoint.title.trim() === "" && isSubmitted
              ? "Campo obligatorio"
              : ""
          }
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={auditDocumentTemplateCheckpoint.description}
          placeholder="Escribe aqui..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SelectInput
          label="Categoria"
          name="cc_audit_document_template_checkpoint_type_id"
          value={
            auditDocumentTemplateCheckpoint.cc_audit_document_template_checkpoint_type_id
          }
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={typesTable}
          columnName="name"
          idColumn="id"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar punto de auditoria
        </SubmitLoadingButton>
      </form>
    </>
  );
}
