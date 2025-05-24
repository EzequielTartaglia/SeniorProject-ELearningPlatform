import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Función para generar colores
const generateColor = (idx) => {
  const colors = [
    { backgroundColor: "rgba(75, 192, 192, 0.2)", borderColor: "rgba(75, 192, 192, 1)" },
    { backgroundColor: "rgba(255, 99, 132, 0.2)", borderColor: "rgba(255, 99, 132, 1)" },
    { backgroundColor: "rgba(54, 162, 235, 0.2)", borderColor: "rgba(54, 162, 235, 1)" },
    { backgroundColor: "rgba(255, 206, 86, 0.2)", borderColor: "rgba(255, 206, 86, 1)" },
  ];
  return colors[idx % colors.length];
};


// Categoriza la edad
const categorizeAge = (age) => {
  if (age < 18) return '- 18 años';
  if (age >= 18 && age <= 30) return '18 - 30 años';
  if (age >= 31 && age <= 40) return '31 - 40 años';
  if (age >= 41 && age <= 50) return '41 - 50 años';
  if (age >= 51 && age <= 65) return '51 - 65 años';
  return '+ 65 años';
};

const AgePieChartTotalEnrollments = ({ enrollments }) => {
  const ageCategories = enrollments.reduce((acc, enrollment) => {
    enrollment.ages.forEach(age => {
      const category = categorizeAge(age);
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(ageCategories),
    datasets: [
      {
        data: Object.values(ageCategories),
        backgroundColor: Object.keys(ageCategories).map(
          (_, idx) => generateColor(idx).backgroundColor
        ),
        borderColor: Object.keys(ageCategories).map(
          (_, idx) => generateColor(idx).borderColor
        ),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4 text-center">
        Recuento de edad en inscripciones
      </h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full h-[400px] flex items-center justify-center">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  color: "#000",
                  font: { size: 18, weight: "bold" },
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
    </div>
  );
};

export default AgePieChartTotalEnrollments;
