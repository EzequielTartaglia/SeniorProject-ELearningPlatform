"use client";

import {
  getAuditDocumentTemplateCheckpoint,
  editAuditDocumentTemplateCheckpoint,
} from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import {
  getAuditDocumentTemplate,
  isAuditDocumentTemplateFromBusiness,
} from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";
import { getAuditDocumentTemplateCheckpointTypes } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint_type/cc_audit_document_template_checkpoint_type";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";
import SelectInput from "../../SelectInput";
import { FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

export default function EditAuditDocumentTemplateCheckpointForm({
  auditDocumentId,
  auditDocumentCheckpointId,
}) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [typesTable, setTypesTable] = useState([]);
  const [sectionsTable, setSectionsTable] = useState([]);

  const [auditDocumentTemplate, setAuditDocumentTemplate] = useState([]);
  const [auditDocumentTemplateCheckpoint, setAuditdocumentTemplateCheckpoint] =
    useState({
      title: "",
      description: "",
      cc_audit_document_template_checkpoint_type_id: null,
      cc_audit_document_template_section_id: "",
    });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedAuditTemplate = await getAuditDocumentTemplate(
          auditDocumentId
        );
        setAuditDocumentTemplate(fetchedAuditTemplate);
        const typesTable = await getAuditDocumentTemplateCheckpointTypes();
        const checkpointFetched = await getAuditDocumentTemplateCheckpoint(
          auditDocumentCheckpointId
        );
        setTypesTable(typesTable);
        setAuditdocumentTemplateCheckpoint(checkpointFetched);

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
  }, [auditDocumentCheckpointId, auditDocumentId]);

  useEffect(() => {
    if (!auditDocumentTemplate || !userControlCenter) return;

    const filterAccess = () => {
      if (
        userControlCenter?.cc_user_role_id === 1 ||
        userControlCenter?.cc_user_role_id === 2 ||
        userControlCenter?.cc_user_role_id === 7
      ) {
        return (
          auditDocumentTemplate?.cc_user_business_id ===
          userControlCenter?.cc_user_business_id
        );
      } else if (
        userControlCenter?.cc_user_role_id === 3 ||
        userControlCenter?.cc_user_role_id === 4 
      ) {
        return true;
      }
    };
    setHasAccess(filterAccess());
  }, [auditDocumentTemplate, userControlCenter]);

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
      await editAuditDocumentTemplateCheckpoint(
        auditDocumentCheckpointId,
        auditDocumentTemplateCheckpoint.title,
        auditDocumentTemplateCheckpoint.description,
        auditDocumentId,
        auditDocumentTemplateCheckpoint.cc_audit_document_template_checkpoint_type_id,
        auditDocumentTemplateCheckpoint.cc_audit_document_template_section_id
      );

      showNotification("¡Punto de auditoria editado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(
          `/control_center/admin/audit_document_templates/${auditDocumentId}`
        );
      }, 2000);
    } catch (error) {
      console.error(
        "Error trying to edit the document template checkpoint:",
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

  if (isLoading || !isMinTimeElapsed) {
    return <LoadingSpinner />;
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <div className="flex flex-col items-center p-6 card-theme border-secondary-light rounded-md shadow-lg">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-red-600 text-3xl font-semibold mb-2">
            Acceso denegado
          </h1>
          <p className="text-white text-center">
            Lo sentimos, no tienes permiso para acceder a esta página. Si crees
            que esto es un error, contacta al administrador.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
            onClick={() => (window.location.href = "/control_center")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Editar punto de auditoria"
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
          onAddRedirect={() =>
            router.push(
              `/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections/new`
            )
          }
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
          Actualizar punto de auditoria
        </SubmitLoadingButton>
      </form>
    </>
  );
}
