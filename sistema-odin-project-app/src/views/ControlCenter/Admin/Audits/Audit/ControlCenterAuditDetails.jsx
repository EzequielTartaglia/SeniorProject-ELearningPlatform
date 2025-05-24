"use client";

import { getAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";
import {
  changeStateToComplete,
  changeStateToIncomplete,
  deleteAuditDocument,
  editAuditDocumentFinalComments,
  getAuditDocument,
  updateAllPoints,
} from "@/src/controllers/control_center/cc_audit_document/cc_audit_document";
import { getAuditDocumentTemplateCheckpointsFromDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { getAuditDocumentCheckpointsFromAuditDocument } from "@/src/controllers/control_center/cc_audit_document_checkpoint/cc_audit_document_checkpoint";
import { getAuditDocumentRatingOptions } from "@/src/controllers/control_center/cc_audit_document_rating_option/cc_audit_document_rating_option";
import { getClient } from "@/src/controllers/control_center/cc_client/cc_client";
import { getAuditDocumentTemplateCheckpointTypes } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint_type/cc_audit_document_template_checkpoint_type";
import { getAuditDocumentTemplateSectionsFromAuditDocumentTemplate } from "@/src/controllers/control_center/cc_audit_document_template_section/cc_audit_document_template_section";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FaExclamationTriangle } from "react-icons/fa";
import EditAllCheckpointList from "./EditAll/EditAllCheckpointList";
import Button from "@/components/Button";
import { FiCommand, FiEdit, FiLock, FiTrash, FiUnlock } from "react-icons/fi";
import formatDate from "@/src/helpers/formatDate";
import AuditDocumentPieChart from "./Charts/AuditTotalCheckpointsPieChart";
import TextArea from "@/components/forms/TextArea";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SearchInput from "@/components/SearchInput";
import AuditDocumentCheckpointTypesAndRatingsPieChart from "./Charts/AuditDocumentCheckpointTypesAndRatingsPieChart";

function sortCheckpointsBySectionAndId(checkpoints) {
  return checkpoints.sort((a, b) => {
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
}

export default function ControlCenterAuditDetails({
  controlCenterAuditDocumentId,
}) {
  const [searchSection, setSearchSection] = useState("");
  const [sectionsTable, setSectionsTable] = useState([]);

  const [searchTitle, setSearchTitle] = useState("");
  const [filteredCheckpoints, setFilteredCheckpoints] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFinalCommentsOpen, setIsModalFinalCommentsOpen] =
    useState(false);

  const [auditDocument, setAuditDocument] = useState([]);
  const [documentTemplate, setDocumentTemplate] = useState([]);
  const [ratingOptionsTable, setRatingOptionsTable] = useState([]);
  const [typesTable, setTypesTable] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [checkpointsAnswers, setCheckpointsAnswers] = useState([]);
  const [client, setClient] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [accessDenied, setAccessDenied] = useState(false);
  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const fetchedAudit = await getAuditDocument(
          controlCenterAuditDocumentId
        );
        
        const sectionsTable =
          await getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
            fetchedAudit.cc_audit_document_template_id
          );
        setSectionsTable(sectionsTable);

        const parsedAccessibleUsers =
          typeof fetchedAudit?.accessible_users === "string"
            ? JSON.parse(fetchedAudit?.accessible_users)
            : fetchedAudit?.accessible_users;

        setAuditDocument({
          ...fetchedAudit,
          accessible_users: parsedAccessibleUsers || [],
        });

        const ratingOptionsTableFetched = await getAuditDocumentRatingOptions();
        setRatingOptionsTable(ratingOptionsTableFetched);

        const fetchedTypes = await getAuditDocumentTemplateCheckpointTypes();
        setTypesTable(fetchedTypes);

        const clientFetched = await getClient(fetchedAudit.cc_client_id);
        setClient(clientFetched);

        const fetchedDocumentTemplate = await getAuditDocumentTemplate(
          fetchedAudit.cc_audit_document_template_id
        );

        if (
          (userControlCenter?.cc_user_role_id === 1 ||
            userControlCenter?.cc_user_role_id === 2 ||
            userControlCenter?.cc_user_role_id === 7) &&
          fetchedDocumentTemplate.cc_user_business_id !==
            userControlCenter?.cc_user_business_id &&
          !parsedAccessibleUsers.includes(userControlCenter?.id)
        ) {
          setAccessDenied(true);
          return;
        }

        setDocumentTemplate(fetchedDocumentTemplate);

        const fetchedCheckpoints =
          await getAuditDocumentTemplateCheckpointsFromDocumentTemplate(
            fetchedDocumentTemplate.id
          );

        const fetchedCheckpointAnswers =
          await getAuditDocumentCheckpointsFromAuditDocument(
            controlCenterAuditDocumentId
          );

        if (fetchedAudit?.cc_state_id === 4) {
          const checkpointsWithoutAnswers = fetchedCheckpoints.filter(
            (checkpoint) =>
              fetchedCheckpointAnswers.some(
                (answer) =>
                  answer.cc_audit_document_template_checkpoint_id ===
                  checkpoint.id
              )
          );

          setCheckpoints(checkpointsWithoutAnswers);
        } else {
          setCheckpoints(fetchedCheckpoints);
        }

        setCheckpointsAnswers(fetchedCheckpointAnswers);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showNotification("Error al cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [controlCenterAuditDocumentId, showNotification, userControlCenter]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditDocument({
      ...auditDocument,
      [name]: value,
    });
  };

  const handleDeleteAudit = async () => {
    setIsModalOpen(true);
  };

  const handleFinishAuditComments = async () => {
    setIsModalFinalCommentsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!auditDocument.final_comments || !auditDocument.final_comments.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      await editAuditDocumentFinalComments(
        controlCenterAuditDocumentId,
        auditDocument?.final_comments
      );
      await updateAllPoints(controlCenterAuditDocumentId);
      await changeStateToComplete(controlCenterAuditDocumentId);
      showNotification("¡Auditoría cerrada exitosamente!", "info");
      setIsModalFinalCommentsOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error trying to edit the document template checkpoint:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleOpenAudit = async () => {
    await changeStateToIncomplete(controlCenterAuditDocumentId);
    showNotification("¡Auditoria abierta exitosamente!", "info");
  };

  const confirmDelete = async () => {
    try {
      await deleteAuditDocument(controlCenterAuditDocumentId);
      showNotification("¡Auditoria eliminada exitosamente!", "info");
      router.push(`/control_center/admin/audits`);
    } catch (error) {
      console.error("Error eliminando la auditoria:", error);
      showNotification(
        "Ocurrió un error al intentar eliminar la auditoria.",
        "danger"
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (
    !documentTemplate ||
    !controlCenterAuditDocumentId ||
    !checkpoints ||
    !checkpointsAnswers ||
    !auditDocument ||
    !client?.name
  ) {
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
        title={"Auditoria"}
        goBackRoute={"/control_center/admin/audits"}
        goBackText={"Volver al listado de auditorias"}
      />

      <div className="box-theme p-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h3 className="text-2xl text-title-active-static font-semibold">
            Informacion general del documento
          </h3>
          <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left font-semibold"></div>

          {auditDocument?.cc_state_id === 4 && (
            <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
              <>
                <span
                  className="px-4 py-2 text-white rounded-md shadow-md transition duration-300 font-semibold"
                  style={{
                    backgroundColor: "#1780e2c4",
                  }}
                >
                  Auditoria cerrada
                </span>
              </>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <h3 className="text-lg font-semibold text-title-active-static">
            Fecha:
          </h3>
          <p className="text-black font-semibold">
            {formatDate(auditDocument.date)}
          </p>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <h3 className="text-lg font-semibold text-title-active-static">
            Cliente a auditar:
          </h3>
          <p className="text-black font-semibold">{client?.name}</p>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <h3 className="text-lg font-semibold text-title-active-static">
            Plantilla de documentacion utilizada:
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

        <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2 ">
          {(userControlCenter?.cc_user_role_id === 2 ||
            userControlCenter?.cc_user_role_id === 3 ||
            userControlCenter?.cc_user_role_id === 4 ||
            userControlCenter?.cc_user_role_id === 7) && (
            <>
              {auditDocument?.cc_state_id !== 4 && (
                <Button
                  customClasses="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  route={`/control_center/admin/audits/${controlCenterAuditDocumentId}/edit`}
                  isAnimated={false}
                  icon={<FiEdit size={24} />}
                  title="Editar auditoria"
                />
              )}

              <Button
                customClasses="mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300 font-semibold"
                customFunction={handleDeleteAudit}
                isAnimated={false}
                icon={<FiTrash size={24} />}
                title="Eliminar auditoria"
              />
            </>
          )}

          {auditDocument?.cc_state_id === 4 && (
            <Button
              customClasses="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
              customFunction={handleOpenAudit}
              isAnimated={false}
              icon={<FiUnlock size={24} />}
              title="Habilitar edicion"
            />
          )}

          {(auditDocument?.cc_state_id === 5 ||
            auditDocument?.cc_state_id === 1) && (
            <>
              <Button
                customClasses="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                customFunction={handleFinishAuditComments}
                isAnimated={false}
                icon={<FiLock size={24} />}
                title="Cerrar auditoria"
              />
            </>
          )}
        </div>
      </div>

      <AuditDocumentCheckpointTypesAndRatingsPieChart
        checkpoints={sortCheckpointsBySectionAndId(filteredCheckpoints)}
        checkpointsAnswers={checkpointsAnswers}
        ratingOptionsTable={ratingOptionsTable}
        typesTable={typesTable}
      />

      {!(
        auditDocument?.cc_state_id === 4 && checkpointsAnswers.length === 0
      ) && (
        <div className="box-theme">
          <h3 className="text-2xl text-title-active-static font-semibold mb-4">
            Puntos de auditoría
          </h3>

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

          <div className="relative">
            {filteredCheckpoints.length === 0 ? (
              <ul className="shadow-md rounded-lg p-1 bg-primary mt-4 relative w-full bg-dark-mode">
                <li className="text-center py-2 text-center text-gray-400">
                  <p>No hay nada para mostrar.</p>
                </li>
              </ul>
            ) : (
              <EditAllCheckpointList
                checkpoints={sortCheckpointsBySectionAndId(filteredCheckpoints)}
                checkpointsAnswers={checkpointsAnswers}
                controlCenterAuditDocumentId={controlCenterAuditDocumentId}
                ratingOptionsTable={ratingOptionsTable}
                typesTable={typesTable}
                isEditable={auditDocument?.cc_state_id !== 4}
              />
            )}
          </div>
        </div>
      )}

      {auditDocument?.cc_state_id === 4 && auditDocument.final_comments && (
        <div className="box-theme mt-4">
          <h3 className="text-2xl text-title-active-static font-semibold mb-4">
            Comentarios finales
          </h3>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-black font-semibold break-words w-full">
              {auditDocument.final_comments}
            </p>
          </div>
        </div>
      )}

      {auditDocument?.cc_state_id === 4 && (
        <div className="box-theme mt-4">
          <h3 className="text-2xl text-title-active-static font-semibold mb-4">
            Resumen
          </h3>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-dark-mode text-white">
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold">
                    Categoría
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-sm font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-dark-mode text-primary">
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    No verificado
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {auditDocument?.total_not_verified_points}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    Implementado
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {auditDocument?.total_implemented_points}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    Parcialmente implementado
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {auditDocument?.total_partially_implemented_points}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    No implementado
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {auditDocument?.total_not_implemented_points}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    No aplica
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                    {auditDocument?.total_excluded_points}
                  </td>
                </tr>
              </tbody>
            </table>

            {auditDocument && (
              <AuditDocumentPieChart auditDocument={auditDocument} />
            )}
          </div>
        </div>
      )}

      {isModalFinalCommentsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-primary p-6 rounded-lg shadow-lg text-center border-card-detail relative z-60 w-90 md:w-96"
          >
            <h3 className="text-lg text-title-active-static font-semibold mb-2">
              Comentarios y/o notas adicionales:
            </h3>
            <TextArea
              label="Comentarios"
              name="final_comments"
              value={auditDocument.final_comments}
              onChange={handleInputChange}
              isSubmitted={isSubmitted}
              errorMessage="El mensaje es requerido."
              required={true}
              rows={4}
              textWhite={true}
              note="Por favor, proporciona detalles adicionales sobre la auditoria."
            />

            <SubmitLoadingButton isLoading={isLoading} type="submit">
              Cerrar auditoria
            </SubmitLoadingButton>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message={
          "¿Estás seguro de que deseas eliminar este documento de auditoría? Esta acción no se puede deshacer."
        }
      />
    </>
  );
}
