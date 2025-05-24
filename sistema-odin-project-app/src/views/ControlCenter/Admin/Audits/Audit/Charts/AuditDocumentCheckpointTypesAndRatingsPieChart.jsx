import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AuditDocumentCheckpointTypesAndRatingsPieChart = ({
  checkpoints,
  checkpointsAnswers,
  ratingOptionsTable,
  typesTable,
}) => {
  const [chartsData, setChartsData] = useState([]);

  useEffect(() => {
    if (checkpoints && ratingOptionsTable && checkpointsAnswers && typesTable) {
      // Agrupar checkpoints por tipo
      const groupedByType = {};

      checkpoints.forEach((checkpoint) => {
        const { cc_audit_document_template_checkpoint_type_id, id } =
          checkpoint;

        // Buscar la respuesta asociada a este checkpoint
        const answer = checkpointsAnswers.find(
          (answer) => answer.cc_audit_document_template_checkpoint_id === id
        );

        if (!answer) return; // Si no hay respuesta, se omite este checkpoint

        const { cc_audit_document_rating_option_id } = answer;

        if (!groupedByType[cc_audit_document_template_checkpoint_type_id]) {
          groupedByType[cc_audit_document_template_checkpoint_type_id] = {};
        }

        if (
          !groupedByType[cc_audit_document_template_checkpoint_type_id][
            cc_audit_document_rating_option_id
          ]
        ) {
          groupedByType[cc_audit_document_template_checkpoint_type_id][
            cc_audit_document_rating_option_id
          ] = 0;
        }

        groupedByType[cc_audit_document_template_checkpoint_type_id][
          cc_audit_document_rating_option_id
        ] += 1;
      });

      // Convertir los datos en estructura de gráficos
      const charts = Object.keys(groupedByType).map((typeId) => {
        const type = typesTable.find((t) => t.id === Number(typeId));
        const typeName = type ? type.name : `Tipo ${typeId}`;

        const ratingCounts = groupedByType[typeId];

        const labels = Object.keys(ratingCounts).map((ratingId) => {
          const rating = ratingOptionsTable.find(
            (r) => Number(r.id) === Number(ratingId)
          );
          return rating ? rating.name : `Opción ${ratingId}`;
        });

        const data = {
          labels,
          datasets: [
            {
              label: `Distribución de respuestas`,
              data: Object.values(ratingCounts),
              backgroundColor: [
                "#1780e2c4",
                "#66c066",
                "#b0be29",
                "#fd7e14",
                "#d3d3d3",
              ],
              borderColor: [
                "#1780e2c4",
                "#66c066",
                "#b0be29",
                "#fd7e14",
                "#d3d3d3",
              ],
              borderWidth: 1,
            },
          ],
        };

        return { typeName, data };
      });

      setChartsData(charts);
    }
  }, [checkpoints, checkpointsAnswers, ratingOptionsTable, typesTable]);

  return (
    checkpointsAnswers.length > 0 &&
    ratingOptionsTable.length > 0 &&
    typesTable.length > 0 && (
      <div className="mt-4 p-4 bg-dark-mode border-dark-mode rounded-lg shadow w-full">
        <h3 className="p-4 text-2xl text-title-active-static font-semibold mb-4 text-left">
          Distribución de puntuaciones por tipo de categoria
        </h3>
        {chartsData.length > 0 ? (
          <div
            className={`grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-${
              chartsData.length > 3 ? 4 : chartsData.length
            } gap-4 justify-center`}
          >
            {chartsData.map(({ typeName, data }, index) => (
              <div
                key={index}
                className="bg-dark-mode p-4 rounded-lg shadow border-dark-mode text-white"
              >
                <h4 className="text-xl font-semibold mb-2 text-center">
                  {typeName}
                </h4>
                <div className="w-full h-[300px] flex items-center justify-center">
                  <Pie
                    data={data}
                    options={{
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            boxWidth: 15,
                            padding: 20,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Cargando gráficos...</p>
        )}
      </div>
    )
  );
};

export default AuditDocumentCheckpointTypesAndRatingsPieChart;
