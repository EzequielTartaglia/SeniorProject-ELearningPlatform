'use client';

import React, { useEffect, useState } from "react";
import { getEnrollmentCountsByCourse } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment_insights";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const EnrollmentDateBarChart = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const allEnrollments = await getEnrollmentCountsByCourse();

        const monthlyEnrollmentCounts = allEnrollments.reduce((acc, enrollment) => {
          const date = new Date(enrollment.enrollment_date);
          const year = date.getFullYear();
          const month = date.getMonth();
          const monthYear = `${year}-${month.toString().padStart(2, '0')}`;

          if (!acc[monthYear]) {
            acc[monthYear] = 0;
          }
          acc[monthYear] += 1;
          return acc;
        }, {});

        const formattedData = Object.entries(monthlyEnrollmentCounts).map(([monthYear, count]) => ({
          monthYear,
          count,
        }));

        formattedData.sort((a, b) => {
          const [yearA, monthA] = a.monthYear.split('-').map(Number);
          const [yearB, monthB] = b.monthYear.split('-').map(Number);
          return yearA - yearB || monthA - monthB;
        });

        setEnrollments(formattedData);
        setFilteredEnrollments(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const yearFilteredData = enrollments.filter(e => e.monthYear.startsWith(selectedYear));
    setFilteredEnrollments(yearFilteredData);
  }, [selectedYear, enrollments]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };

  const years = [...new Set(enrollments.map(e => e.monthYear.split('-')[0]))];
  const uniqueYears = [...years];

  const isMobile = window.innerWidth < 640; // sm breakpoint in Tailwind CSS

  const chartData = {
    labels: filteredEnrollments.map(e => {
      const [year, month] = e.monthYear.split('-').map(Number);
      return `${monthNames[month]}`;
    }),
    datasets: [
      {
        label: `Inscripciones por mes y año (${selectedYear})`,
        data: filteredEnrollments.map(e => e.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 30,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000',
          font: {
            size: 18,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} inscripciones`,
        },
        backgroundColor: '#fff',
        titleColor: '#1070ca',
        bodyColor: '#1070ca',
        borderColor: '#1070ca',
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha',
          color: '#000',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#000',
          font: {
            size: isMobile ? 10 : 12,
            weight: 'bold'
          },
          autoSkip: false,
          maxRotation: isMobile ? 90 : 0,
        },
        grid: {
          drawBorder: true,
          borderColor: '#000',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Número de Inscripciones',
          color: '#000',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        ticks: {
          color: '#000',
          font: {
            size: isMobile ? 12 : 10,
            weight: 'bold'
          },
          stepSize: 1,
          maxRotation: 0,
        },
        grid: {
          drawBorder: true,
          borderColor: '#000',
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Recuento de inscripciones por mes y año</h2>
      <div className="flex flex-col mb-4">
        <label htmlFor="year-selector" className="block text-black font-bold mb-2">
          Selecciona un año:
        </label>
        <select
          id="year-selector"
          value={selectedYear}
          onChange={handleYearChange}
          className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {uniqueYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
        <div className={`relative w-full h-96 ${isMobile ? 'sm' : ''}`}>
          <Bar
            data={chartData}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDateBarChart;
