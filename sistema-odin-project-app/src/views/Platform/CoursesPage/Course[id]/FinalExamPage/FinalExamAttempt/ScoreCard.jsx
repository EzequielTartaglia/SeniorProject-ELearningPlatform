import ListWithTitle from "@/components/lists/ListWithTitle";
import React from "react";

export default function ScoreCard({
  totalAttempts,
  bestScore,
  maxScore,
  percentScore,
  items,
  attemptsTriedThisPeriod,
  nextActivationDate,
  status,
  buttonShowRoute,
}) {
  // Define the shouldShowButton function
  const shouldShowButton = (id) => {
    // Your logic to determine if the button should be shown
    return true; // or some condition based on the id
  };

  return (
    <div className="box-theme">
      <div className="flex justify-between mb-4">
        <div className="w-1/2">
          <h3 className="text-lg font-semibold text-primary">
            Total de Intentos:
          </h3>
          <p className="text-primary">{totalAttempts}</p>
        </div>
        <div className="w-1/2 text-right">
          <h3 className="text-lg font-semibold text-primary">Mejor Puntaje:</h3>
          <p className="text-primary">
            {bestScore.toFixed(2)} / {maxScore.toFixed(2)} ({percentScore} %)
          </p>
        </div>
      </div>

      <ListWithTitle
        title={"Intentos"}
        items={items}
        columnName={"date"}
        columnNameIsDate
        labelColumnName2={"Puntuacion"}
        columnName2={"score"}
        hasEdit={false}
        hasShow={shouldShowButton}
        buttonShowRoute={buttonShowRoute}
        hasAdd={false}
        hasDelete={false}
      />

      <div className="flex justify-between">
        <div className="w-1/2 mt-3">
          <h3 className="text-lg font-semibold text-primary">
            <span
              className={`${
                status
                  ? "text-lg font-semibold px-2 py-1 rounded bg-green-400 text-green-700 border-2 border-green-700"
                  : totalAttempts > 0
                  ? "text-lg font-semibold px-2 py-1 rounded border bg-red-400 text-red-700 border-2 border-red-700"
                  : ""
              }`}
            >
              {status ? "Aprobado" : totalAttempts > 0 && "Desaprobado"}
            </span>
          </h3>
        </div>
        <div className="w-1/2 text-right mt-3">
          <h3 className="text-lg font-semibold text-primary">
            Intentos: {attemptsTriedThisPeriod} / 3
          </h3>
        </div>
      </div>

      {attemptsTriedThisPeriod === 3 && (
        <div className="flex justify-between">
          <div className="w-1/2"></div>
          <div className="w-1/2 text-right mt-3">
            <h3 className={`text-sm font-semibold text-gray-400 italic`}>
              Proxima fecha de habilitacion: {nextActivationDate}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
