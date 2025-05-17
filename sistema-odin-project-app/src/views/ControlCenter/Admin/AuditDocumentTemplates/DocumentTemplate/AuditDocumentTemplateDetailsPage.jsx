"use client";

import {
  getAuditDocumentTemplate,
  deleteAuditDocumentTemplate,
} from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import { FiEdit, FiTrash } from "react-icons/fi";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  deleteAuditDocumentTemplateCheckpoint,
  getAuditDocumentTemplateCheckpointsFromDocumentTemplate,
} from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { FaExclamationTriangle } from "react-icons/fa";
import AuditDocumentTemplateCheckpointsListWithTitle from "@/components/lists/control_center/AuditDocumentTemplateCheckpointsListWithTitle";
import SearchInput from "@/components/SearchInput";

export default function AuditDocumentTemplateDetailsPage({ auditDocumentId }) {
  const [sectionsTable, setSectionsTable] = useState([]);
  const [searchSection, setSearchSection] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [filteredCheckpoints, setFilteredCheckpoints] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [documentTemplate, setDocumentTemplate] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const fetchedDocumentTemplate = await getAuditDocumentTemplate(
          auditDocumentId
        );

        const sectionsTable =
          await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
            auditDocumentId
          );
        setSectionsTable(sectionsTable);

        if (
          (userControlCenter?.cc_user_role_id === 1 ||
            userControlCenter?.cc_user_role_id === 2 ||
            userControlCenter?.cc_user_role_id === 7) &&
          fetchedDocumentTemplate.cc_user_business_id !==
            userControlCenter?.cc_user_business_id
        ) {
          setAccessDenied(true);
          return;
        }

        setDocumentTemplate(fetchedDocumentTemplate);

        const fetchedCheckpoints =
          await getAuditDocumentTemplateCheckpointsFromDocumentTemplate(
            auditDocumentId
          );
        setCheckpoints(fetchedCheckpoints);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showNotification("Error al cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [auditDocumentId, showNotification, userControlCenter]);

  useEffect(() => {
    const updatedCheckpoints = checkpoints.map((checkpoint) => {
      const section = sectionsTable.find(
        (section) =>
          section.id === checkpoint.cc_audit_document_template_section_id
      );
      return {
        ...checkpoint,
        section_name: section ? section.name : "Sección desconocida",
      };
    });

    const lowerCaseSection = searchSection.toLowerCase();
    const lowerCaseTitle = searchTitle.toLowerCase();

    const filtered = updatedCheckpoints.filter(
      (checkpoint) =>
        checkpoint.section_name.toLowerCase().includes(lowerCaseSection) &&
        checkpoint.title.toLowerCase().includes(lowerCaseTitle)
    );

    setFilteredCheckpoints(filtered);
  }, [searchSection, searchTitle, checkpoints, sectionsTable]);

  const handleDeleteTreatment = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAuditDocumentTemplate(auditDocumentId);
      showNotification("¡Documento eliminado exitosamente!", "info");
      router.push(`/control_center/admin/audit_document_templates`);
    } catch (error) {
      console.error("Error eliminando el documento:", error);
      showNotification(
        "Ocurrió un error al intentar eliminar el documento.",
        "danger"
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteAuditCheckpoint = async (id) => {
    try {
      await deleteAuditDocumentTemplateCheckpoint(id);
      setCheckpoints((prevCheckpoints) =>
        prevCheckpoints.filter((checkpoint) => checkpoint.id !== id)
      );
      showNotification("¡Punto de auditoría eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar punto de auditoría:", error.message);
    }
  };

  if (!documentTemplate) {
    return <LoadingSpinner />;
  }
  if (accessDenied) {
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
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md  transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
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
        title={"Detalles de plantilla de legajo para auditorías"}
        goBackRoute={"/control_center/admin/audit_document_templates"}
        goBackText={"Volver al listado de plantillas de legajo para auditorías"}
      />

      <div
        className="flex flex-col items-center md:items-end w-full 
                                    sm:min-w-[700px] sm:max-w-[700px]   
                                    md:min-w-[800px] md:max-w-[800px] 
                                    lg:min-w-[860px] lg:max-w-[1280px] 
                                    xl:min-w-[1280px] xl:max-w-[1536px]"
      >
        <Button
          route={`/control_center/admin/audit_document_templates/${auditDocumentId}/cc_audit_document_template_sections`}
          customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
          text={"Editar secciones de la auditoria"}
          icon={<FiEdit size={24} />}
          title={"Edita las secciones que aparecen en los puntos de auditoria"}
        />
      </div>

      <div className="box-theme p-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h3 className="text-2xl text-title-active-static font-semibold">
            Informacion general del documento
          </h3>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <h3 className="text-lg font-semibold text-title-active-static">
            Titulo:
          </h3>
          <p className="text-black font-semibold">{documentTemplate.title}</p>
        </div>

        {documentTemplate.description && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow flex flex-col justify-between items-start">
            <h3 className="text-lg font-semibold text-title-active-static">
              Descripcion:
            </h3>
            <p className="text-black font-semibold break-words w-full">
              {documentTemplate.description}
            </p>
          </div>
        )}

        <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
          {(userControlCenter?.cc_user_role_id === 2 ||
            userControlCenter?.cc_user_role_id === 3 ||
            userControlCenter?.cc_user_role_id === 4 ||
            userControlCenter?.cc_user_role_id === 7) && (
            <>
              <Button
                customClasses="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                route={`/control_center/admin/audit_document_templates/${auditDocumentId}/edit`}
                isAnimated={false}
                icon={<FiEdit size={24} />}
                title="Editar"
              />

              <Button
                customClasses="mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300 font-semibold"
                customFunction={handleDeleteTreatment}
                isAnimated={false}
                icon={<FiTrash size={24} />}
                title="Eliminar documento"
              />
            </>
          )}
        </div>
      </div>

      <AuditDocumentTemplateCheckpointsListWithTitle
        customRender={
          <div className="p-4 box-theme shadow rounded-lg mb-4 w-full bg-white">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 ">
              <SearchInput
                placeholder="Buscar por sección..."
                value={searchSection}
                onChange={(e) => setSearchSection(e.target.value)}
                className="w-full sm:w-1/2"
              />
              <SearchInput
                placeholder="Buscar por punto de auditoría..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full sm:w-1/2"
              />
            </div>
          </div>
        }
        title="Puntos de auditoria"
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
            ? `/control_center/admin/audit_document_templates/${auditDocumentId}/audit_document_template_checkpoints/new`
            : null
        }
        items={filteredCheckpoints}
        sections={sectionsTable}
        buttonShowRoute={(id) =>
          `/control_center/admin/audit_document_templates/${auditDocumentId}/audit_document_template_checkpoints/${id}`
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
            ? `/control_center/admin/audit_document_templates/${auditDocumentId}/audit_document_template_checkpoints/${id}/edit`
            : null
        }
        hasDelete={
          userControlCenter?.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonDeleteRoute={handleDeleteAuditCheckpoint}
        columnName="title"
        confirmModalText="¿Estás seguro de que deseas eliminar este punto de auditoria?"
        hasShow={(id) => null}
      />

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message={"¿Estas seguro que deseas eliminar este documento?"}
      />
    </>
  );
}
