"use client";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";
import {
  deleteAuditDocumentTemplateSection,
  getAuditDocumentTemplateSectionsFromAuditDocumentTemplate,
} from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

export default function AuditDocumentTemplateSectionsPage({ auditDocumentId }) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [auditTemplateSections, setAuditTemplateSections] = useState([]);

  const [filteredAuditTemplateSections, setFilteredAuditTemplateSections] =
    useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchAuditTemplateSections() {
      try {
        const sections =
          await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
            auditDocumentId
          );

        setAuditTemplateSections(Array.isArray(sections) ? sections : []);
        setFilteredAuditTemplateSections(
          Array.isArray(sections) ? sections : []
        );
      } catch (error) {
        console.error(
          "Error al obtener los nombres de las secciones:",
          error.message
        );
      }
    }
    fetchAuditTemplateSections();
  }, [auditDocumentId]);

  useEffect(() => {
    if (
      !Array.isArray(auditTemplateSections) ||
      auditTemplateSections.length === 0
    )
      return;

    if (searchTerm === "") {
      setFilteredAuditTemplateSections(auditTemplateSections);
    } else {
      setFilteredAuditTemplateSections(
        auditTemplateSections.filter((audit_template_section) =>
          audit_template_section.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [auditTemplateSections, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteAuditTemplateSection = async (id) => {
    try {
      await deleteAuditDocumentTemplateSection(id);
      setAuditTemplateSections((prevNames) =>
        prevNames.filter(
          (audit_template_section) => audit_template_section.id !== id
        )
      );
      showNotification("¡Seccion eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar seccion:", error.message);
    }
  };

  return (
    <>
      <PageHeader
        title={"Secciones de la plantilla de auditoría"}
        goBackRoute={`/control_center/admin/audit_document_templates/${auditDocumentId}`}
        goBackText={"Volver a la informacion general"}
      />

      <SearchInput
        placeholder="Buscar secciones..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <ListWithTitle
        title=""
        hasAdd={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonAddRoute={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
            ? `/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections/new`
            : null
        }
        items={filteredAuditTemplateSections}
        buttonShowRoute={(id) =>
          `/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections/${id}`
        }
        hasEdit={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonEditRoute={(id) =>
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
            ? `/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections/${id}/edit`
            : null
        }
        hasDelete={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonDeleteRoute={handleDeleteAuditTemplateSection}
        columnName="name"
        confirmModalText="¿Estás seguro de que deseas eliminar esta seccion de la plantilla de auditoria?"
        hasShow={(id) => null}
      />
    </>
  );
}
