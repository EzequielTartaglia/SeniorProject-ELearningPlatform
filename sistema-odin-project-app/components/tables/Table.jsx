"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiEdit,
  FiEye,
  FiPlus,
  FiSettings,
  FiTrash2,
} from "react-icons/fi";
import ConfirmModal from "../ConfirmModal";

export default function Table({
  columns,
  data,
  title,
  columnAliases,
  hasAdd = true,
  hasShow = (item) => false,
  hasEdit = (item) => false,
  hasEditTitleText = "Editar",
  hasDelete = true,
  hasApprove = (item) => false,
  hasCustomButton = (item) => false,
  buttonAddRoute,
  buttonShowRoute,
  buttonEditRoute,
  buttonDeleteRoute,
  buttonApproveRoute,
  customButtonRoute,
  confirmModalText,
  customButton,
}) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(data.length === 0);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

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

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
      setIsMediumScreen(window.innerWidth >= 640 && window.innerWidth < 1224);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const PageNumbers = () => {
    if (data.length <= itemsPerPage) return null;

    const totalPages = Math.ceil(data.length / itemsPerPage);

    return (
      <div className="flex justify-center my-4">
        <button
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronsLeft />
        </button>

        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronLeft />
        </button>

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronRight />
        </button>

        <button
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === totalPages
              ? "bg-disabled text-title-active-static border-secondary-light"
              : "bg-disabled border-primary-light"
          }`}
        >
          <FiChevronsRight />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="table-box font-semibold">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-white border-opacity-25 px-6 py-2"
                >
                  {columnAliases[column] || column}
                </th>
              ))}
              {(hasShow ||
                hasEdit ||
                hasDelete ||
                hasApprove ||
                hasCustomButton) && (
                <th className="border border-white border-opacity-25 px-6 py-2">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center p-2 rounded-lg"
              >
                <div className="flex justify-center items-center h-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 spinner-border border-opacity-50"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${title ? "box-theme text-title-active-static" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-title-active-static">
            {title && title}
          </h3>
          {hasAdd && buttonAddRoute && (
            <Link href={buttonAddRoute}>
              <button
                className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
                title="Agregar"
              >
                <FiPlus size={24} />
              </button>
            </Link>
          )}
          {customButton && <>{customButton}</>}
        </div>
        <div className="table-box font-semibold">
          <table className="min-w-full border border-gray-200">
            {!isSmallScreen && !isMediumScreen && (
              <thead>
                <tr className="box-theme">
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="border border-white border-opacity-25 px-6 py-2"
                    >
                      {columnAliases[column] || column}
                    </th>
                  ))}
                  {(hasShow ||
                    hasEdit ||
                    hasDelete ||
                    hasApprove ||
                    hasCustomButton) && (
                    <th className="border border-white border-opacity-25 px-6 py-2">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
            )}
            <tbody>
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center p-2 text-primary border border-white border-opacity-25 px-6 py-2"
                >
                  No hay nada que mostrar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (isSmallScreen || isMediumScreen) {
    return (
      <div className={`${title ? "box-theme text-title-active-static" : ""}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-title-active-static">
            {title && title}
          </h3>
          {hasAdd && buttonAddRoute && (
            <Link href={buttonAddRoute}>
              <button
                className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
                title="Agregar"
              >
                <FiPlus size={24} />
              </button>
            </Link>
          )}
          {customButton && <>{customButton}</>}
        </div>
        <div className="border table-box font-semibold mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="">
              {currentItems.map((item, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="text-center p-2 text-primary border border-white border-opacity-25 px-6 py-2">
                    {columns.map((column, colIndex) => (
                      <div
                        key={colIndex}
                        className="flex flex-wrap items-center p-2"
                      >
                        <div className="text-sm font-medium">
                          {columnAliases[column] || column}:
                        </div>
                        <div className="text-sm ml-2 break-words text-title-active-static">
                          {item[column]}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center mt-4">
                      {(hasShow ||
                        hasEdit ||
                        hasDelete ||
                        hasApprove ||
                        hasCustomButton) && (
                        <>
                          {hasShow(item) && (
                            <Link
                              href={buttonShowRoute(item.id)}
                              className="text-title-active mr-4"
                              title="Ver"
                            >
                              <FiEye className="text-lg" size={24} />
                            </Link>
                          )}
                          {hasEdit(item) && (
                            <Link
                              href={buttonEditRoute(item.id)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4"
                              title={hasEditTitleText}
                            >
                              <FiEdit className="text-lg" size={24} />
                            </Link>
                          )}

                          {hasApprove(item) && (
                            <button
                              title="Aprobar"
                              onClick={() => buttonApproveRoute(item.id)}
                              className="text-green-500 hover:text-green-700"
                            >
                              <FiCheck className="text-lg" size={24} />
                            </button>
                          )}

                          {hasCustomButton(item) && (
                            <Link
                              href={customButtonRoute(item.id)}
                              className="text-gray-400 hover:text-gray-300 mr-4"
                              title="Administrar"
                            >
                              <FiSettings className="text-lg" size={24} />
                            </Link>
                          )}

                          {hasDelete && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar"
                            >
                              <FiTrash2 className="text-lg" size={24} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PageNumbers />
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
      </div>
    );
  }

  return (
    <div className={`${title ? "box-theme text-title-active-static" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-title-active-static">
          {title && title}
        </h3>
        {hasAdd && buttonAddRoute && (
          <Link href={buttonAddRoute}>
            <button
              className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
              title="Agregar"
            >
              <FiPlus size={24} />
            </button>
          </Link>
        )}
        {customButton && <>{customButton}</>}
      </div>
      <div className="border table-box font-semibold mt-4">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="box-theme">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="border border-white border-opacity-25 px-6 py-2"
                >
                  {columnAliases[column] || column}
                </th>
              ))}
              {(hasShow ||
                hasEdit ||
                hasDelete ||
                hasApprove ||
                hasCustomButton) && (
                <th className="border border-white border-opacity-25 px-6 py-2">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-white border-opacity-25 px-6 py-2"
                  >
                    {item[column]}
                  </td>
                ))}
                <td className=" border-white border border-opacity-25 px-6 py-6 flex items-center ">
                  {(hasShow || hasEdit || hasDelete || hasApprove) && (
                    <>
                      {hasShow(item) && (
                        <Link
                          href={buttonShowRoute(item.id)}
                          className="text-title-active mr-4"
                          title="Ver"
                        >
                          <FiEye className="text-lg" size={24} />
                        </Link>
                      )}
                      {hasEdit(item) && (
                        <Link
                          href={buttonEditRoute(item.id)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                          title={hasEditTitleText}
                        >
                          <FiEdit className="text-lg" size={24} />
                        </Link>
                      )}
                      {hasApprove(item) && (
                        <button
                          title="Aprobar"
                          onClick={() => buttonApproveRoute(item.id)}
                          className="text-green-500 hover:text-green-700 mr-4"
                        >
                          <FiCheck className="text-lg" size={24} />
                        </button>
                      )}

                      {hasCustomButton(item) && (
                        <Link
                          href={customButtonRoute(item.id)}
                          className="text-gray-400 hover:text-gray-300 mr-4"
                          title="Administrar"
                        >
                          <FiSettings className="text-lg" size={24} />
                        </Link>
                      )}

                      {hasDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Eliminar"
                        >
                          <FiTrash2 className="text-lg" size={24} />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <PageNumbers />
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
    </div>
  );
}
