"use client";

import { useEffect, useState } from "react";
import { getControlCenterUserBusinesses } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";
import {
  deleteAuditDocument,
  getAuditDocuments,
  getAuditDocumentsByBusiness,
} from "@/src/controllers/control_center/cc_audit_document/cc_audit_document";
import { getControlCenterUsers } from "@/src/controllers/control_center/control_center_user/control_center_user";
import { getClients } from "@/src/controllers/control_center/cc_client/cc_client";
import { getAuditDocumentTemplateCheckpointsFromDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { getAuditDocumentCheckpointsFromAuditDocument } from "@/src/controllers/control_center/cc_audit_document_checkpoint/cc_audit_document_checkpoint";
import { getAuditDocumentRatingOptions } from "@/src/controllers/control_center/cc_audit_document_rating_option/cc_audit_document_rating_option";

import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import formatDate from "@/src/helpers/formatDate";
import { FiLock, FiUnlock } from "react-icons/fi";
import AuditDocumentsTable from "@/components/tables/control_center/AuditDocumentsTable";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

export default function ControlCenterAuditsPage() {
  const [audits, setAudits] = useState([]);
  const [sectionsTable, setSectionsTable] = useState([]);
  const [platformUserBusinesses, setPlatformUserBusinesses] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          fetchedAudits,
          fetchedUserBusinesses,
          fetchedClients,
          fetchedUsers,
        ] = await Promise.all([
          getAuditDocuments(),
          getControlCenterUserBusinesses(),
          getClients(),
          getControlCenterUsers(),
        ]);
        setAudits(fetchedAudits || []);
        setPlatformUserBusinesses(fetchedUserBusinesses || []);
        setClients(fetchedClients || []);
        setUsers(fetchedUsers || []);
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
    async function filterData() {
      if (!userControlCenter || !audits.length) return;

      let resultAudits = [];

      if (userControlCenter.cc_user_role_id === 1) {
        resultAudits = audits.filter((audit) => {
          const parsedAccessibleUsers =
            typeof audit?.accessible_users === "string"
              ? JSON.parse(audit?.accessible_users)
              : audit?.accessible_users;

          return (
            audit.created_by_cc_user_id === userControlCenter.id ||
            (parsedAccessibleUsers &&
              parsedAccessibleUsers.includes(userControlCenter.id))
          );
        });
      } else if (userControlCenter?.cc_user_role_id === 2 ||
        userControlCenter?.cc_user_role_id === 7) {
        try {
          const fetchedAudits = await getAuditDocumentsByBusiness(
            userControlCenter?.cc_user_business_id
          );
          resultAudits = fetchedAudits || [];
        } catch (error) {
          console.error("Error fetching audits by business:", error.message);
        }
      } else if (
        userControlCenter?.cc_user_role_id === 3 ||
        userControlCenter?.cc_user_role_id === 4
      ) {
        resultAudits = audits;
      }

      const filtered = resultAudits.map((audit) => {
        const userPlatformBusiness = platformUserBusinesses.find(
          (business) => business.id === audit.created_by_cc_user_business_id
        );

        const clientName = clients.find(
          (client) => client.id === audit.cc_client_id
        );
        const userInfo = users.find(
          (user) => user.id === audit.created_by_cc_user_id
        );

        const lockIcon =
          audit.cc_state_id === 4 ? (
            <span title="Auditoría cerrada">
              <FiLock size={24} className="w-full text-red-500" />
            </span>
          ) : audit.cc_state_id === 1 || audit.cc_state_id === 5 ? (
            <span title="Auditoría activa">
              <FiUnlock size={24} className="w-full" />
            </span>
          ) : null;

        return {
          id: audit.id,
          date: formatDate(audit.date),
          clientName: clientName?.name || "N/A",
          created_by_cc_user_id: audit.created_by_cc_user_id,
          full_name: `${userInfo.first_name} ${userInfo.last_name}`,
          state: lockIcon,
          is_finished: audit.cc_state_id === 4,
          created_by_cc_user_business_id: userPlatformBusiness?.name || "N/A",
        };
      });

      setFilteredData(filtered);
    }

    filterData();
  }, [audits, clients, platformUserBusinesses, userControlCenter, users]);

  const handleClientSearchChange = (event) => {
    setClientSearchTerm(event.target.value);
  };

  const handleUserSearchChange = (event) => {
    setUserSearchTerm(event.target.value);
  };

  const columns = ["date", "clientName", "full_name", "state"];
  const columnAliases = {
    date: "Fecha",
    clientName: "Cliente auditado",
    full_name: "Creado por",
    state: "Estado",
  };

  const hasShow = () =>
    [1, 2, 3, 4].includes(userControlCenter?.cc_user_role_id);

  const hasEdit = () => false;

  const hasDelete = () =>
    [2, 3, 4].includes(userControlCenter?.cc_user_role_id);

  const hasDownloadAuditDocument = (auditId) => {
    const audit = audits.find((audit) => audit.id === auditId);
    return audit?.cc_state_id === 4;
  };

  const cleanText = (text) => {
    if (!text) return text;

    const cleanText = text.replace(/^\uFEFF/, "");

    return cleanText.replace(/[μ]/g, "u").replace(/[^\x00-\x7F]/g, "");
  };

  const handleDownloadAuditDocumentRoute = async (auditId) => {
    try {
      const audit = audits.find((audit) => audit.id === auditId);

      if (!audit) {
        console.error("Auditoría no encontrada");
        return;
      }

      const sectionsTable =
        await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
          audit.cc_audit_document_template_id
        );
      setSectionsTable(sectionsTable);

      const fetchedClient = await clients.find(
        (client) => client.id === audit.cc_client_id
      );

      const auditDocumentTemplateCheckpointsInfo =
        await getAuditDocumentTemplateCheckpointsFromDocumentTemplate(
          audit.cc_audit_document_template_id
        );

        const sectionsMap = sectionsTable.reduce((acc, section) => {
          acc[section.id] = section.name;
          return acc;
        }, {});
        
        const fetchedDocumentTemplateCheckpoints = auditDocumentTemplateCheckpointsInfo
          .map((checkpoint) => ({
            ...checkpoint,
            section_name: cleanText(
              sectionsMap[checkpoint.cc_audit_document_template_section_id] ||
                "Sección no encontrada"
            ),
            section_id: Number(checkpoint.cc_audit_document_template_section_id) || 0, 
          }))
          .sort((a, b) => a.section_id - b.section_id); 
        
      const fetchedAuditCheckpoints =
        await getAuditDocumentCheckpointsFromAuditDocument(audit.id);

      const fetchedRatingOptions = await getAuditDocumentRatingOptions();

      if (
        !audit ||
        !fetchedAuditCheckpoints ||
        !fetchedRatingOptions ||
        !fetchedClient ||
        !fetchedDocumentTemplateCheckpoints
      ) {
        console.error(
          "Información de auditoría o plantilla de auditoría no encontrada"
        );
        return;
      }

      const cleanedAudit = {
        ...audit,
        title: cleanText(audit.title),
      };

      const cleanedClient = {
        ...fetchedClient,
        name: cleanText(fetchedClient.name),
      };

      const cleanedDocumentTemplateCheckpoints =
        fetchedDocumentTemplateCheckpoints.map((checkpoint) => ({
          ...checkpoint,
          section_name: cleanText(
            sectionsMap[checkpoint.cc_audit_document_template_section_id] ||
              "Sección no encontrada"
          ),
          title: cleanText(checkpoint.title),
        }));

      const cleanedAuditCheckpoints = fetchedAuditCheckpoints.map(
        (checkpoint) => ({
          ...checkpoint,
          title: cleanText(checkpoint.title),
        })
      );

      const cleanedRatingOptions = fetchedRatingOptions.map((option) => ({
        ...option,
        name: cleanText(option.name),
      }));

      const response = await fetch(
        `/api/control_center/admin/audits/${auditId}/audit_report_pdf`,
        {
          method: "POST",
          body: JSON.stringify({
            audit: cleanedAudit,
            auditCheckpoints: cleanedAuditCheckpoints,
            ratingOptions: cleanedRatingOptions,
            client: cleanedClient,
            templateCheckpoints: cleanedDocumentTemplateCheckpoints,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const client_name = cleanedClient.name || "Cliente";

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${client_name}_auditoria.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error("Error al generar el PDF");
        showNotification("Error al generar la auditoría.", "danger");
      }
    } catch (error) {
      console.error("Error al descargar la auditoría:", error);
      showNotification("Error al descargar la auditoría.", "danger");
    }
  };

  const handleDeleteAudit = async (id) => {
    try {
      await deleteAuditDocument(id);
      showNotification("¡Auditoría eliminada exitosamente!", "info");

      setAudits((prevAudits) => prevAudits.filter((audit) => audit.id !== id));
      setFilteredData((prevData) =>
        prevData.filter((audit) => audit.id !== id)
      );
    } catch (error) {
      console.error("Error deleting audit document:", error.message);
      showNotification("Error al eliminar la auditoría.", "error");
    }
  };

  if (loading || !audits || !clients || !isMinTimeElapsed) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={"Gestionar auditorias"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <div className="p-4 w-full">
        <div className="flex-col md:flex-row flex justify-center mb-4 gap-0 md:gap-4">
          <SearchInput
            placeholder="Buscar por cliente..."
            value={clientSearchTerm}
            onChange={handleClientSearchChange}
          />
          <SearchInput
            placeholder="Buscar por auditor..."
            value={userSearchTerm}
            onChange={handleUserSearchChange}
          />
        </div>
      </div>

      <AuditDocumentsTable
        title={"Auditorias registradas"}
        columns={columns}
        data={filteredData.filter(
          (item) =>
            item.clientName
              .toLowerCase()
              .includes(clientSearchTerm.toLowerCase()) &&
            item.full_name.toLowerCase().includes(userSearchTerm.toLowerCase())
        )}
        columnAliases={columnAliases}
        hasAdd={[1, 2, 3, 4].includes(userControlCenter?.cc_user_role_id)}
        buttonAddRoute={`/control_center/admin/audits/new`}
        hasShow={hasShow}
        buttonShowRoute={(id) => `/control_center/admin/audits/${id}`}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/control_center/admin/audits/${id}/edit`}
        hasDelete={hasDelete}
        hasDownloadAuditDocument={(audit) => audit.is_finished}
        buttonDownloadAuditDocumentRoute={(auditId) =>
          handleDownloadAuditDocumentRoute(auditId)
        }
        buttonDeleteRoute={handleDeleteAudit}
        confirmModalText={
          "¿Estás seguro de que deseas eliminar esta auditoria?"
        }
      />
    </>
  );
}
