"use client";

import { useState, useEffect } from "react";
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
import SearchInput from "@/components/SearchInput";
import { getEnrollmentCountsByCourse } from "@/src/models/platform/student_course_enrollment/student_course_enrollment_insights";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (dateString) => {
  const [month, year] = dateString.split(" de ");
  const capitalizedMonth = capitalizeFirstLetter(month);
  return `${capitalizedMonth} - ${year}`;
};

const parseDate = (dateString) => {
  const [month, year] = dateString.split(" - ");
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const monthIndex = months.indexOf(month);
  return new Date(year, monthIndex);
};

const generateColor = (idx) => {
  const colors = [
    "rgba(75, 192, 192, 0.2)",
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
  ];
  return colors[idx % colors.length];
};

const CountryBarChartEnrollmentsByCourse = ({ courses }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        setLoading(true);
        const allEnrollments = await getEnrollmentCountsByCourse();
        setEnrollments(allEnrollments);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollments();
  }, []);

  // Obtener años únicos de las inscripciones
  const years = [
    ...new Set(
      enrollments.map((enrollment) =>
        new Date(enrollment.enrollment_date).getFullYear()
      )
    ),
  ];

  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar las inscripciones por año seleccionado
  const filteredEnrollments = selectedYear
    ? enrollments.filter(
        (enrollment) =>
          new Date(enrollment.enrollment_date).getFullYear() ===
          parseInt(selectedYear, 10)
      )
    : enrollments;

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4 text-center text-primary">
        Recuento de inscripciones por fecha y curso
      </h2>
      <div className="flex flex-col mb-4">
        <label htmlFor="currency" className="block text-black font-bold mb-2">
          Selecciona el año:
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">Todos los años disponibles</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

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
              const courseEnrollments = filteredEnrollments.filter(
                (enrollment) => enrollment.course_id === course.id
              );

              // Si no hay inscripciones para el año seleccionado, no renderizar el gráfico
              if (courseEnrollments.length === 0) {
                return null;
              }

              // Agrupar por fecha de inscripción
              const totalByDate = courseEnrollments.reduce(
                (acc, enrollment) => {
                  const date = new Date(
                    enrollment.enrollment_date
                  ).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  });
                  const formattedDate = formatDate(date);
                  acc[formattedDate] = (acc[formattedDate] || 0) + 1;
                  return acc;
                },
                {}
              );

              // Ordenar fechas
              const sortedDates = Object.keys(totalByDate).sort(
                (a, b) => parseDate(a) - parseDate(b)
              );

              const chartData = {
                labels: sortedDates,
                datasets: [
                  {
                    label: "Inscripciones",
                    data: sortedDates.map((date) => totalByDate[date]),
                    backgroundColor: sortedDates.map((_, idx) =>
                      generateColor(idx)
                    ),
                    borderColor: sortedDates.map((_, idx) =>
                      generateColor(idx).replace("0.2", "1")
                    ),
                    borderWidth: 1,
                  },
                ],
              };

              return (
                <div
                  key={course.id}
                  className="w-full h-[340px] flex flex-col items-center p-4 border border-gray-200 shadow-lg bg-white rounded-lg"
                >
                  <h3 className="text-lg font-semibold mb-2 text-center text-primary">
                    {course.name}
                  </h3>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
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
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: "Fecha",
                            color: "#000",
                            font: {
                              size: 16,
                              weight: "bold",
                            },
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: "Número de Inscripciones",
                            color: "#000",
                            font: {
                              size: 16,
                              weight: "bold",
                            },
                          },
                          ticks: {
                            stepSize: 1, 
                            beginAtZero: true, 
                          },
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

export default CountryBarChartEnrollmentsByCourse;
