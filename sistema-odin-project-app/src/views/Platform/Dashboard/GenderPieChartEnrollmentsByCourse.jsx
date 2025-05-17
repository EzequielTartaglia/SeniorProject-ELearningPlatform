"use client";

import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import SearchInput from "@/components/SearchInput";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Función para generar colores
const generateColor = (idx) => {
  const colors = [
    {
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
    {
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
    },
    {
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
    },
    {
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
    },
  ];
  return colors[idx % colors.length];
};

const GenderPieChartEnrollmentsByCourse = ({ enrollments, courses }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4 text-center">Recuento de género por curso</h2>
      <div className="flex flex-col items-center w-full mb-4">
        <SearchInput
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, idx) => {
              const courseEnrollments = enrollments.filter(
                (enrollment) => enrollment.course_id === course.id
              );
              const totalGenders = courseEnrollments.reduce((acc, enrollment) => {
                Object.keys(enrollment.genders).forEach((gender) => {
                  acc[gender] = (acc[gender] || 0) + enrollment.genders[gender];
                });
                return acc;
              }, {});

              const chartData = {
                labels: Object.keys(totalGenders),
                datasets: [
                  {
                    data: Object.values(totalGenders),
                    backgroundColor: Object.keys(totalGenders).map(
                      (_, idx) => generateColor(idx).backgroundColor
                    ),
                    borderColor: Object.keys(totalGenders).map(
                      (_, idx) => generateColor(idx).borderColor
                    ),
                    borderWidth: 2,
                  },
                ],
              };

              return (
                <div
                  key={course.id}
                  className="w-full h-[340px] flex flex-col items-center p-4 border border-gray-200 shadow-lg bg-white rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-2 text-center">{course.name}</h3>
                  <Doughnut
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "right",
                          labels: {
                            color: "#000",
                            font: { size: 16, weight: "bold" },
                          },
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const total = context.dataset.data.reduce(
                                (acc, val) => acc + val,
                                0
                              );
                              const percentage = (
                                (context.raw / total) *
                                100
                              ).toFixed(2);
                              return `${context.raw} Inscripciones (${percentage}%)`;
                            },
                          },
                          backgroundColor: "#fff",
                          titleColor: "#1070ca",
                          bodyColor: "#1070ca",
                          borderColor: "#1070ca",
                        },
                      },
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center p-4 border border-gray-200 shadow-lg bg-white rounded-lg">
              <p>No se encontraron cursos que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenderPieChartEnrollmentsByCourse;
