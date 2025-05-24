import Button from "@/components/Button";
import React from "react";
import { FiEdit } from "react-icons/fi";

export default function ExamDetailCard({
  title,
  description,
  minScore,
  questionsCount,
  totalPoints,
  editRoute,
  hasEdit = true,
}) {
  return (
    <div className="box-theme">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Título del Examen:</h3>
        <p className="text-primary">{title}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Descripción:</h3>
        <p className="text-primary">{description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">Preguntas:</h3>
        <p className="text-primary">{questionsCount}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">
        Puntaje maximo posible:
        </h3>
        <p className="text-primary">{totalPoints}</p>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary">
        Puntaje minimo para aprobar:
        </h3>
        <p className="text-primary">{(totalPoints * minScore) / 100} ({minScore} %)</p>
      </div>

      <div className="flex justify-end">
        {hasEdit && (
          <Button
            customClasses="flex items-center shadow-none text-title-active"
            route={editRoute}
            icon={<FiEdit size={24}/>}
            isAnimated={false}
            title="Editar datos generales"
          />
        )}
      </div>
    </div>
  );
}
