import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { useState } from "react";
import { FaBook, FaChalkboardTeacher, FaInfoCircle } from "react-icons/fa";
import {
  FiChevronDown,
  FiChevronUp,
  FiEdit,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

export default function ModuleDropdown({
  moduleId,
  module,
  moduleClasses,
  buttonShowRoute,
  buttonEditRoute,
  buttonDeleteRoute,
  buttonAddRouteModuleClass,
  buttonEditRouteModule,
  buttonDeleteRouteModule,
  columnName,
  hasAddClass = true,
  hasEditModule = true,
  hasDeleteModule = true,
  hasShowClass = true,
  hasEditClass = true,
  hasDeleteClass = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalModuleOpen, setIsModalModuleOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isDeletingModuleClass, setIsDeletingModuleClass] = useState(false);

  const handleDelete = (id, event) => {
    event.stopPropagation();
    setCurrentId(id);
    setIsDeletingModuleClass(false);
    setIsModalOpen(true);
  };

  const handleDeleteModule = (event) => {
    event.stopPropagation();
    setCurrentId(moduleId);
    setIsDeletingModuleClass(true);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (isDeletingModuleClass) {
      buttonDeleteRouteModule(currentId);
    } else {
      buttonDeleteRoute(currentId);
    }
    setIsModalOpen(false);
    setIsModalModuleOpen(false);
    setCurrentId(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsModalModuleOpen(false);
    setCurrentId(null);
  };

  const handleEditModule = (event) => {
    event.stopPropagation();
  };

  const handleAddModuleClass = (event) => {
    event.stopPropagation();
  };

  const sortedModuleClasses = moduleClasses.sort((a, b) => a.id - b.id);
  const lastItemIndex = sortedModuleClasses.length - 1;

  return (
    <div className="w-full  lg:mx-auto">
      <div
        className="li-theme flex items-center justify-between  text-primary rounded-md px-6 py-3 shadow-md transition duration-300 hover:-translate-y-1 w-full cursor-pointer font-semibold"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
        <span className="truncate pr-4 text-primary">{module[columnName]}</span>
        <div className="flex items-center space-x-2">
          {hasAddClass && (
            <Link
              href={buttonAddRouteModuleClass(moduleId)}
              onClick={handleAddModuleClass}
              alt="Crear nueva clase"
              title="Crear nueva clase"
            >
              <FiPlus className="text-show-link" size={24} />
            </Link>
          )}
          {hasEditModule && (
            <Link
              href={buttonEditRouteModule(moduleId)}
              onClick={handleEditModule}
              alt="Editar modulo"
              title="Editar modulo"
            >
              <FiEdit className="text-edit-link" size={24} />
            </Link>
          )}
          {hasDeleteModule && (
            <button onClick={handleDeleteModule} title="Eliminar modulo">
              <FiTrash2 className="text-delete-link" size={24} />
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 bg-secondary rounded-md shadow-lg p-4 font-semibold max-w-full lg:w-full">
          {module.description && (
            <div className="flex items-start mb-4 p-2 bg-primary rounded-md max-w-full">
              <div className="flex-shrink-0">
                <FaInfoCircle className="w-6 h-6" size={24} />
              </div>
              <p className="text-sm text-disabled max-w-full break-words ml-2 whitespace-pre-wrap">
                {module.description}
              </p>
            </div>
          )}
          <ul>
            {sortedModuleClasses.length > 0 ? (
              sortedModuleClasses.map((courseClass, index) => (
                <li
                  key={courseClass.id}
                  className={`flex justify-between items-center pb-2 my-2 ${
                    index === lastItemIndex && !courseClass.hasBorderBottom
                      ? "border-b-none"
                      : "border-b pb-0"
                  } border-gray-200`}
                >
                  <div className="truncate">{courseClass.title}</div>
                  <div className="flex items-center space-x-2">
                    {hasShowClass && (
                      <Link
                        href={buttonShowRoute(moduleId, courseClass.id)}
                        alt="Ver clase"
                        title="Ver clase"
                      >
                        <FaBook className="text-show-link" size={24} />
                      </Link>
                    )}
                    {hasEditClass && (
                      <Link
                        href={buttonEditRoute(moduleId, courseClass.id)}
                        alt="Editar clase"
                        title="Editar clase"
                      >
                        <FiEdit className="text-edit-link" size={24} />
                      </Link>
                    )}
                    {hasDeleteClass && (
                      <button
                        onClick={(event) => handleDelete(courseClass.id, event)}
                        title="Eliminar clase"
                      >
                        <FiTrash2 className="text-delete-link" size={24} />
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-400">
                No hay clases disponibles para el módulo.
              </li>
            )}
          </ul>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen || isModalModuleOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message={
          isDeletingModuleClass
            ? "¿Estás seguro de que deseas eliminar este módulo?"
            : "¿Estás seguro de que deseas eliminar esta clase?"
        }
      />
    </div>
  );
}
