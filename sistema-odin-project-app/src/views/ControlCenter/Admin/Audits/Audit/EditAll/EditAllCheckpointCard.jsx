"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import {
  FiEdit,
  FiEyeOff,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import EditCheckpointForm from "./EditCheckpointForm";
import CreateCheckpointForm from "./CreateCheckpointForm";

const EditAllCheckpointCard = ({
  checkpoint,
  checkpointsAnswers,
  index,
  ratingOptionName,
  typeName,
  description,
  controlCenterAuditDocumentId,
  isEditable,
  showForm,
  showFormCreate,
  onEdit,
  onCreate,
}) => {
  const [currentImage, setCurrentImage] = useState(null);

  const availableImages = [1, 2, 3, 4, 5].filter(
    (num) =>
      checkpointsAnswers[index]?.[`has_image_preview_${num}`] &&
      checkpointsAnswers[index]?.[`image_preview_link_${num}`]
  );

  const nextImage = () => {
    if (currentImage === null) return;
    const currentIndex = availableImages.indexOf(currentImage);
    const nextIndex = (currentIndex + 1) % availableImages.length;
    setCurrentImage(availableImages[nextIndex]);
  };

  const prevImage = () => {
    if (currentImage === null) return;
    const currentIndex = availableImages.indexOf(currentImage);
    const prevIndex =
      (currentIndex - 1 + availableImages.length) % availableImages.length;
    setCurrentImage(availableImages[prevIndex]);
  };

  return (
    <div className="my-4 p-4 bg-white rounded-lg shadow flex flex-col justify-between items-start">
      <div className="w-full">
        <h4 className="text-lg font-bold text-title-active-static">
          {checkpoint.title}
        </h4>

        {checkpoint.section_name && (
          <p className="mt-2 text-sm text-title-active-static">
            <strong>Sección:</strong> {checkpoint.section_name}
          </p>
        )}

        {typeName && (
          <p className="mt-2 text-sm text-title-active-static">
            <strong>Categoría:</strong> {typeName || "Sin respuesta"}
          </p>
        )}
        {checkpoint.description && (
          <p className="mt-2 text-sm text-title-active-static">
            <strong>Descripción del punto:</strong> {checkpoint.description}
          </p>
        )}

        <p className="mt-6 text-sm text-gray-700">
          <strong>Puntuación:</strong> {ratingOptionName || "Sin respuesta"}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          <strong>Comentarios adicionales:</strong>{" "}
          {description || "Sin comentarios"}
        </p>
      </div>

      {availableImages.length > 0 && (
        <div className="w-full flex flex-wrap gap-2 mt-4">
          {availableImages.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentImage(num)}
              className={`px-2 py-1 text-sm rounded-md shadow-md transition duration-300 border ${
                currentImage === num
                  ? "bg-dark-mode text-white"
                  : "bg-dark-mode text-title-active-static hover:bg-secondary-light"
              }`}
            >
              {currentImage === num ? `Ocultar ${num}` : `Imagen ${num}`}
            </button>
          ))}
        </div>
      )}

      {currentImage !== null && (
        <div className="w-full mt-4 flex flex-col items-center">
          <div className="p-4 bg-white rounded-lg shadow flex flex-col justify-between items-center">
            <label className="mt-4 block text-sm font-medium text-gray-700">
              Miniatura de Imagen {currentImage}
            </label>
            <div className="mt-2 relative w-full max-w-[800px]">
              <Image
                src={
                  checkpointsAnswers[index]?.[
                    `image_preview_link_${currentImage}`
                  ]
                }
                alt={`Vista previa ${currentImage}`}
                width={800}
                height={800}
                className="border rounded-md"
                unoptimized
              />

              <button
                onClick={prevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-dark-mode text-title-active-static border-dark-mode p-2 rounded-full shadow-md hover:bg-secondary-light transition"
              >
                <FiChevronLeft size={24} />
              </button>

              <button
                onClick={nextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-dark-mode text-title-active-static border-dark-mode p-2 rounded-full shadow-md hover:bg-secondary-light transition"
              >
                <FiChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditable && (
        <div className="flex justify-end w-full mt-4">
          {checkpoint?.id && checkpointsAnswers[index]?.id ? (
            <Button
              customFunction={() => onEdit()}
              customClasses="px-2 py-1 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light text-title-active-static font-semibold bg-dark-mode cursor-pointer"
              isAnimated={false}
              icon={showForm ? <FiEyeOff size={24} /> : <FiEdit size={24} />}
              title="Editar punto de auditoría"
            />
          ) : (
            checkpoint?.id &&
            !checkpointsAnswers[index]?.id && (
              <Button
                customFunction={() => onCreate()}
                customClasses="px-2 py-1 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light text-title-active-static font-semibold bg-dark-mode cursor-pointer"
                isAnimated={false}
                icon={
                  showFormCreate ? <FiEyeOff size={24} /> : <FiPlus size={24} />
                }
                title="Crear punto de auditoría"
              />
            )
          )}
        </div>
      )}

      {showForm && isEditable && (
        <EditCheckpointForm
          checkpointId={checkpointsAnswers[index]?.id}
          controlCenterAuditDocumentId={controlCenterAuditDocumentId}
          onCancel={() => onEdit()}
          checkpointTemplateId={
            checkpointsAnswers[index]?.cc_audit_document_template_checkpoint_id
          }
        />
      )}

      {showFormCreate && isEditable && (
        <CreateCheckpointForm
          checkpointTemplateId={checkpoint.id}
          controlCenterAuditDocumentId={controlCenterAuditDocumentId}
          onCreate={() => onCreate()}
        />
      )}
    </div>
  );
};

export default EditAllCheckpointCard;
