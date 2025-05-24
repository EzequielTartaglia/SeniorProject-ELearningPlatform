import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

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

const CountryPieChartTotalEnrollments = ({ enrollments }) => {
  const totalCountries = enrollments.reduce((acc, enrollment) => {
    Object.keys(enrollment.countries).forEach((country) => {
      acc[country] = (acc[country] || 0) + enrollment.countries[country];
    });
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(totalCountries),
    datasets: [
      {
        data: Object.values(totalCountries),
        backgroundColor: Object.keys(totalCountries).map(
          (_, idx) => generateColor(idx).backgroundColor
        ),
        borderColor: Object.keys(totalCountries).map(
          (_, idx) => generateColor(idx).borderColor
        ),
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full">
      <h2 className="text-xl font-bold mb-4 text-center">
         Recuento de pais en inscripciones
      </h2>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg w-full  h-[400px] flex items-center justify-center">
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
                  label: (context) => `${context.raw} Inscripciones`,
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

export default CountryPieChartTotalEnrollments;
