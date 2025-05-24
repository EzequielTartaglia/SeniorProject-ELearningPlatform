"use client";

import {
  getAuditDocumentTemplates,
  getAuditDocumentTemplate,
} from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";
import { getControlCenterUserBusinesses } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";
import DocumentTemplatesTable from "@/components/tables/control_center/DocumentTemplatesTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAuditDocumentTemplateCheckpointsFromDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

export default function AuditDocumentTemplatesPage() {
  const [documentTemplates, setDocumentTemplates] = useState([]);
  const [sectionsTable, setSectionsTable] = useState([]);
  const [platformUserBusinesses, setPlatformUserBusinesses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const fetchedDocumentTemplates = await getAuditDocumentTemplates();
        const fetchedUserBusinesses = await getControlCenterUserBusinesses();

        setDocumentTemplates(fetchedDocumentTemplates);
        setPlatformUserBusinesses(fetchedUserBusinesses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showNotification("Error al cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showNotification]);

  useEffect(() => {
    function filterData() {
      const resultData = documentTemplates
        .filter((document) => {
          if (
            userControlCenter?.cc_user_role_id === 1 ||
            userControlCenter?.cc_user_role_id === 2 ||
            userControlCenter?.cc_user_role_id === 7
          ) {
            return (
              document?.cc_user_business_id ===
              userControlCenter?.cc_user_business_id
            );
          } else if (
            userControlCenter?.cc_user_role_id === 3 ||
            userControlCenter?.cc_user_role_id === 4
          ) {
            return true;
          }
          return false;
        })
        .map((document) => {
          const userPlatformBusiness = platformUserBusinesses.find(
            (business) => business.id === document.cc_user_business_id
          );

          return {
            id: document.id,
            title: document.title,
            cc_user_business_id: userPlatformBusiness
              ? userPlatformBusiness.name
              : "N/A",
          };
        });

      setFilteredData(resultData);
    }

    filterData();
  }, [documentTemplates, platformUserBusinesses, userControlCenter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = ["title", "cc_user_business_id"];

  const columnAliases = {
    title: "Título",
    cc_user_business_id: "Empresa",
  };

  const hasShow = (item) => {
    return (
      userControlCenter.cc_user_role_id === 1 ||
      userControlCenter.cc_user_role_id === 2 ||
      userControlCenter.cc_user_role_id === 3 ||
      userControlCenter.cc_user_role_id === 4 ||
      userControlCenter?.cc_user_role_id === 7
    );
  };

  const hasEdit = (item) => {
    return;
  };

  const hasApprove = (item) => {
    return;
  };

  const hasDownloadAuditDocumentTemplate = (item) => {
    return true;
  };

  const cleanText = (text) => {
    return text.replace(/[μ]/g, "u").replace(/[^\x00-\x7F]/g, "");
  };

  const handleDownloadAuditDocumentTemplateRoute = async (documentId) => {
    try {
      const auditDocumentTemplate = documentTemplates.find(
        (document) => document.id === documentId
      );
  
      if (!auditDocumentTemplate) {
        console.error("Plantilla de auditoría no encontrada");
        return;
      }
  
      const sectionsTable =
        await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
          auditDocumentTemplate.id
        );
      setSectionsTable(sectionsTable);
  
      const auditDocumentTemplateInfo = await getAuditDocumentTemplate(documentId);
      auditDocumentTemplateInfo.title = cleanText(auditDocumentTemplateInfo.title);
  
      let fetchedCheckpoints =
        await getAuditDocumentTemplateCheckpointsFromDocumentTemplate(documentId);
  
      const sectionsMap = sectionsTable.reduce((acc, section) => {
        acc[section.id] = section.name; 
        return acc;
      }, {});
  
      fetchedCheckpoints = fetchedCheckpoints.map((checkpoint) => ({
        ...checkpoint,
        section_name: cleanText(sectionsMap[checkpoint.cc_audit_document_template_section_id] || "Sección no encontrada"),
        title: cleanText(checkpoint.title),
      }));
  
      fetchedCheckpoints = fetchedCheckpoints.sort((a, b) => {
        const numberA = parseInt(a.section_name.match(/^\d+/)?.[0] || 0, 10);
        const numberB = parseInt(b.section_name.match(/^\d+/)?.[0] || 0, 10);
  
        if (numberA !== numberB) {
          return numberA - numberB;
        }
  
        const sectionComparison = a.section_name.localeCompare(b.section_name);
        if (sectionComparison !== 0) {
          return sectionComparison;
        }
  
        return a.title.localeCompare(b.title);
      });
  
      const auditDocumentTemplateTitle =
        auditDocumentTemplateInfo.title || "Documento";
  
      const response = await fetch(
        `/api/control_center/admin/audit_document_templates/${documentId}/audit_document_template_pdf`,
        {
          method: "POST",
          body: JSON.stringify({
            auditDocumentTemplateInfo,
            auditDocumentTemplateCheckpointsInfo: fetchedCheckpoints,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${auditDocumentTemplateTitle}_plantilla_de_auditoria.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Error al generar el PDF");
        showNotification("Error al generar plantilla de auditoría.", "danger");
      }
    } catch (error) {
      console.error("Error al descargar la plantilla de auditoría:", error);
      showNotification("Error al descargar la plantilla de auditoría.", "danger");
    }
  };
  
  if (!filteredData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={"Gestionar plantillas de legajos para auditorías"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <div className="p-4 w-full">
        <div className="flex justify-center mb-4">
          <SearchInput
            placeholder="Buscar título..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <DocumentTemplatesTable
        title={"Plantillas registradas"}
        columns={columns}
        data={filteredData.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        columnAliases={columnAliases}
        hasAdd={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonAddRoute={`/control_center/admin/audit_document_templates/new`}
        hasShow={() => true}
        buttonShowRoute={(id) =>
          `/control_center/admin/audit_document_templates/${id}`
        }
        hasEdit={() => false}
        hasDelete={false}
        hasDownloadAuditDocumentTemplate={hasDownloadAuditDocumentTemplate}
        buttonDownloadAuditDocumentTemplateRoute={(documentId) =>
          handleDownloadAuditDocumentTemplateRoute(documentId)
        }
      />
    </>
  );
}
