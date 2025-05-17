import { useState } from "react";
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
import ConfirmModal from "../ConfirmModal";
import Link from "next/link";
import formatDate from "@/src/helpers/formatDate";
import ReactDOM from "react-dom";

export default function CoursesListProfile({
  list,
  buttonShowRoute = null,
  buttonEditRoute = null,
  buttonDeleteRoute = null,
  buttonAddRoute = null,
  columnName = "name",
  columnNameIsDate,
  labelColumnName2,
  columnName2,
  labelColumnName3,
  columnName3,
  confirmModalText,
  hasShow = (id) => false,
  hasShowIcon = <FiEye className="text-show-link" size={24} />,
  hasEdit = (id) => false,
  hasDelete = (id) => false,
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
    const aValue = a[columnName] ? String(a[columnName]) : "";
    const bValue = b[columnName] ? String(b[columnName]) : "";
    return aValue.localeCompare(bValue);
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
        <ul className="flex flex-col gap-5 text-primary list-none p-0 w-full">
          {currentPageItems.map((item) => (
            <li
              key={item.id}
              className="bg-dark-mode rounded-md px-6 py-3 shadow-md transition duration-300 hover:-translate-y-1  w-full border-dark-mode relative flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-2 overflow-hidden truncate sm:truncate max-w-[400px]">
                <div className="pr-16 sm:pr-16 md:pr-0 lg:pr-0 flex-1">
                  <span>
                    {columnNameIsDate
                      ? formatDate(item[columnName])
                      : item[columnName]}
                  </span>{" "}
                  {item.professor && (
                    <div className="mt-2">
                      <div className="text-[9px] text-xs md:text-xs text-primary">
                        Profesor: {item.professor.first_name}{" "}
                        {item.professor.last_name}
                      </div>
                    </div>
                  )}
                  {labelColumnName3 && (
                    <span className="ml-3 mr-3">
                      {labelColumnName3}: {item[columnName3]}
                    </span>
                  )}
                  {/* Completion Percentage */}
                  {item.progress && item.progress > 0 && (
                    <div className="mt-2">
                      <div className="text-[9px] text-xs md:text-xs text-primary">
                        <span className="sm:hidden">Completado</span>
                        <span className="hidden sm:inline">
                          Completado (clases)
                        </span>

                        <span className="ml-2 font-bold">
                          {item.progress.toFixed(2)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="relative w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="absolute inset-0 rounded-full bg-gray-300"
                            style={{ width: "100%" }}
                          />
                          <div
                            className={`absolute inset-0 rounded-full ${
                              item.progress < 34
                                ? "bg-red-500"
                                : item.progress >= 34.99 &&
                                  item.progress <= 50.99
                                ? "bg-orange-500"
                                : item.progress >= 51.99 &&
                                  item.progress <= 66.99
                                ? "bg-yellow-500"
                                : item.progress >= 67.99 &&
                                  item.progress <= 99.99
                                ? "bg-green-500"
                                : item.progress >= 100
                                ? "bg-blue-500"
                                : ""
                            }`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {hasExtraButton3(item.id) && (
                  <Link
                    href={buttonEditRoute3(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Mas informacion"
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
                {hasEdit(item.id) && (
                  <Link
                    href={buttonEditRoute(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Editar"
                  >
                    <FiEdit className="text-edit-link" size={24} />
                  </Link>
                )}
                {hasDelete(item.id) && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="ml-2 flex-shrink-0"
                    title="Eliminar"
                  >
                    <FiTrash2 className="text-delete-link" size={24} />
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
