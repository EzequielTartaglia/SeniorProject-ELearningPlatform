import { useState } from "react";
import ReactDOM from "react-dom"; 
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSettings,
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiChevronsRight,
  FiChevronsLeft,
} from "react-icons/fi";
import Link from "next/link";
import formatDate from "@/src/helpers/formatDate";
import ConfirmModal from "@/components/ConfirmModal";

export default function AuditDocumenTemplateCheckpointList({
  list,
  sections,
  buttonShowRoute = null,
  buttonEditRoute = null,
  buttonDeleteRoute = null,
  buttonAddRoute = null,
  columnName = "name",
  columnSectionName = "cc_audit_document_template_section_id",
  columnNameIsDate,
  labelColumnName2,
  columnName2,
  labelColumnName3,
  columnName3,
  confirmModalText,
  hasShow = (id) => false,
  hasShowIcon = <FiEye className="text-show-link" size={24} />,
  hasEdit = true,
  hasDelete = true,
  hasExtraButton = () => false,
  extraButtonIcon = <FiSettings className="text-title-active" size={24} />,
  extraButtonTitle = () => "",
  onExtraButtonClick,
  hasExtraButton2 = () => false,
  extraButtonIcon2 = <FiSettings className="text-title-active" size={24} />,
  extraButtonTitle2 = () => "",
  onExtraButtonClick2,
  hasExtraButton3 = () => false,
  extraButtonIcon3 = <FiFileText className="text-title-active" size={24} />,
  extraButtonTitle3 = () => "",
  buttonEditRoute3 = null,
  itemsPerPage = 15,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (id) => {
    setCurrentId(id);
    setIsModalOpen(true);
  };

  const getSectionName = (sectionId) => {
    const section = sections?.find((sec) => sec.id === sectionId);
    return section ? section.name : "Sección desconocida";
  };

  const confirmDelete = () => {
    if (buttonDeleteRoute) {
      buttonDeleteRoute(currentId);
    }
    setIsModalOpen(false);
    setCurrentId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentId(null);
  };

  const sortedList = list.sort((a, b) => {
    const aValue = a[columnSectionName] ? String(a[columnSectionName]) : "";
    const bValue = b[columnSectionName] ? String(b[columnSectionName]) : "";

    const result = aValue.localeCompare(bValue);

    if (result === 0) {
      return a.id - b.id;
    }

    return result;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const currentPageItems = sortedList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  return (
    <>
      <div className="relative">
        {buttonAddRoute && (
          <Link href={buttonAddRoute}>
            <button
              className="p-2 rounded-full bg-secondary text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 absolute top-0 right-0 mt-2 mr-2"
              title="Agregar"
            >
              <FiPlus size={24} />
            </button>
          </Link>
        )}
        <ul className="space-y-4">
          {currentPageItems.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
            >
              <div className="flex flex-col space-y-2 overflow-visible">
                <div className="pr-16 sm:pr-16 md:pr-0 lg:pr-0">
                  <h4 className="text-lg text-title-active-static">
                    <strong className="font-semibold">Sección:</strong>{" "}
                    {getSectionName(item[columnSectionName])}
                  </h4>

                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Título:</strong>{" "}
                    {columnNameIsDate
                      ? formatDate(item[columnName])
                      : item[columnName]}
                  </p>

                  {labelColumnName2 && (
                    <span className="ml-3 mr-3">
                      {labelColumnName2}: {item[columnName2]}
                    </span>
                  )}
                  {labelColumnName3 && (
                    <span className="ml-3 mr-3">
                      {labelColumnName3}: {item[columnName3]}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {hasExtraButton3(item.id) && (
                  <Link
                    href={buttonEditRoute3(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Más información"
                  >
                    {extraButtonIcon3}
                  </Link>
                )}
                {hasExtraButton(item.id) && (
                  <button
                    className="ml-2"
                    title={extraButtonTitle(item.id)}
                    onClick={() => onExtraButtonClick(item.id)}
                  >
                    {extraButtonIcon}
                  </button>
                )}
                {hasExtraButton2(item.id) && (
                  <button
                    className="ml-2"
                    title={extraButtonTitle2(item.id)}
                    onClick={() => onExtraButtonClick2(item.id)}
                  >
                    {extraButtonIcon2}
                  </button>
                )}
                {hasShow(item.id) && (
                  <Link
                    href={buttonShowRoute(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Ver detalles"
                  >
                    {hasShowIcon}
                  </Link>
                )}
                {hasEdit && (
                  <Link
                    href={buttonEditRoute(item.id)}
                    className="bg-dark-mode border-dark-mode rounded-md p-2 ml-2 flex-shrink-0 text-blue-500"
                    title="Editar"
                  >
                    <FiEdit className="" size={24} />
                  </Link>
                )}
                {hasDelete && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-dark-mode border-dark-mode rounded-md p-2 ml-2 flex-shrink-0 text-red-500"
                    title="Eliminar"
                  >
                    <FiTrash2 className="" size={24} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mt-4">
            <div className="flex justify-center">
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="p-1 mx-1 bg-secondary text-primary rounded hover:bg-primary hover:text-secondary disabled:opacity-50"
              >
                <FiChevronsLeft size={24} />
              </button>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-1 mx-1 bg-secondary text-primary rounded hover:bg-primary hover:text-secondary disabled:opacity-50"
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-1 mx-1 bg-secondary text-primary rounded hover:bg-primary hover:text-secondary disabled:opacity-50"
              >
                <FiChevronRight size={24} />
              </button>
              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="p-1  mx-1 bg-secondary text-primary rounded hover:bg-primary hover:text-secondary disabled:opacity-50"
              >
                <FiChevronsRight size={24} />
              </button>
            </div>
            {/* Display current page and total pages */}
            <p className="text-primary mt-2">
              Página {currentPage} / {totalPages}
            </p>
          </div>
        )}
      </div>

      {/* Render the modal outside of the main component using portal */}
      {isModalOpen &&
        ReactDOM.createPortal(
          <ConfirmModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onConfirm={confirmDelete}
            message={confirmModalText}
          />,
          document.body
        )}
    </>
  );
}
