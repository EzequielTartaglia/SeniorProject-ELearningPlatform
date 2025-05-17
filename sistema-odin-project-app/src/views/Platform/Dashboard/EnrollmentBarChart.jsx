"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const EnrollmentBarChart = ({ enrollments, courses }) => {
  // Ordenar las inscripciones de mayor a menor
  const sortedEnrollments = enrollments
    .map((enrollment) => {
      const course = courses.find(
        (course) => course.id === enrollment.course_id
      );
      return {
        name: course ? course.name : "Curso desconocido",
        total_enrollments: enrollment.total_enrollments,
      };
    })
    .sort((a, b) => b.total_enrollments - a.total_enrollments); // Ordenar de mayor a menor

  // Preparar los datos para el gráfico
  const chartData = {
    labels: sortedEnrollments.map((enrollment) => enrollment.name),
    datasets: [
      {
        label: "Inscripciones por Curso",
        data: sortedEnrollments.map(
          (enrollment) => enrollment.total_enrollments
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        barThickness: 30,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.5)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  // Calcular los valores mínimos y máximos para los ticks
  const maxEnrollment = Math.max(...chartData.datasets[0].data);
  const minEnrollment = Math.min(...chartData.datasets[0].data);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full h-full">
      <h2 className="text-xl font-bold mb-4 text-center">
        Recuento de inscripciones por curso
      </h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full h-[500px]">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "#000",
                  font: {
                    size: 18,
                    weight: "bold",
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return ` ${context.raw} Inscripciones`;
                  },
                },
                backgroundColor: "#fff",
                titleColor: "#1070ca",
                bodyColor: "#1070ca",
                borderColor: "#1070ca",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Inscripciones",
                  color: "#000",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                ticks: {
                  color: "#000",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                  // Formatear los ticks del eje X como enteros y eliminar duplicados
                  callback: (value) => Math.floor(value),
                },
                // Configurar los pasos entre ticks
                scaleLabel: {
                  show: true,
                  labelString: 'Inscripciones',
                },
                ticks: {
                  stepSize: 1, // Ajustar para mostrar cada entero
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Cursos",
                  color: "#000",
                  font: {
                    size: 16,
                    weight: "bold",
                  },
                },
                ticks: {
                  color: "#000",
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default EnrollmentBarChart;
