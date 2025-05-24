'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CourseRevenueChart = ({ enrollments, courses }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('No aplica'); 

    const filteredEnrollments = enrollments
      .filter(enrollment => enrollment.currency_abbreviation === selectedCurrency)
      .reduce((acc, enrollment) => {
        const course = courses.find(course => course.id === enrollment.course_id);
        const courseName = course ? course.name : 'Curso desconocido';

        const existingCourse = acc.find(item => item.name === courseName);
        if (existingCourse) {
          existingCourse.total_payments += enrollment.total_payments; 
        } else {
          acc.push({
            name: courseName,
            total_payments: enrollment.total_payments, 
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.total_payments - a.total_payments);

    const chartData = {
      labels: filteredEnrollments.map(enrollment => enrollment.name),
      datasets: [
        {
          label: `Ganancias por Curso (${selectedCurrency})`,
          data: filteredEnrollments.map(enrollment => enrollment.total_payments),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          barThickness: 30,
          hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
          hoverBorderColor: 'rgba(75, 192, 192, 1)',
        }
      ],
    };

    const handleCurrencyChange = (e) => {
      setSelectedCurrency(e.target.value);
    };

    const currencies = [...new Set(enrollments.map(enrollment => enrollment.currency_abbreviation))];
    
    const uniqueCurrencies = ['No aplica', ...currencies.filter(currency => currency !== 'No aplica')];

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full h-full">
        <h2 className="text-xl font-bold mb-4 text-center">Recuento de ganancia por curso</h2>
        <div className="flex flex-col mb-4">
          <label htmlFor="currency" className="block text-black font-bold mb-2">
            Selecciona la divisa:
          </label>
          <select
            id="currency"
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {uniqueCurrencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
          <div className="relative w-full h-96">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
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
                      label: (context) => ` $ ${context.raw} en Ganancias`,
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
                      text: 'Ganancias',
                      color: '#000',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    },
                    ticks: {
                      color: '#000',
                      font: {
                        size: 12,
                        weight: 'bold'
                      }
                    },
                    grid: {
                      drawBorder: true,
                      borderColor: '#000',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Cursos',
                      color: '#000',
                      font: {
                        size: 16,
                        weight: 'bold'
                      }
                    },
                    ticks: {
                      color: '#000',
                      font: {
                        size: 12,
                        weight: 'bold'
                      },
                      maxRotation: 45,
                      minRotation: 0
                    },
                    grid: {
                      drawBorder: true,
                      borderColor: '#000',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    );
};

export default CourseRevenueChart;
