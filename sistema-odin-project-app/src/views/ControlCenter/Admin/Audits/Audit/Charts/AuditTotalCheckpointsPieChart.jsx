import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const AuditDocumentPieChart = ({ auditDocument }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (auditDocument) {
      // Datos para el gráfico
      const data = {
        labels: [
          "No verificado",
          "Implementado",
          "Parcialmente implementado",
          "No implementado",
          "No aplica",
        ],
        datasets: [
          {
            label: "Total de puntos",
            data: [
              auditDocument?.total_not_verified_points || 0,
              auditDocument?.total_implemented_points || 0,
              auditDocument?.total_partially_implemented_points || 0,
              auditDocument?.total_not_implemented_points || 0,
              auditDocument?.total_excluded_points || 0,
            ],
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

      setChartData(data);
    }
  }, [auditDocument]);

  return (
    <div className="mt-4 p-4 bg-dark-mode border-dark-mode rounded-lg shadow w-full">
      <h3 className="p-4 text-2xl text-title-active-static font-semibold mb-4 text-left">
        Puntos de auditoria por puntuaciones
      </h3>
      {chartData.datasets ? (
        <div className="w-full max-w-xl mx-auto h-[300px] flex items-center justify-center">
          <Pie
            data={chartData}
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
      ) : (
        <p>Cargando gráfico...</p>
      )}
    </div>
  );
  
};

export default AuditDocumentPieChart;
