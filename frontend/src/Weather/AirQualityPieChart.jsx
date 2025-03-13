import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const AirQualityPieChart = ({ pollutants }) => {
  if (!pollutants) {
    return <p className="text-white text-center">Loading pollution data...</p>;
  }

  const data = {
    labels: ["PM2.5", "PM10", "CO", "NO2", "SO2", "O3"],
    datasets: [
      {
        data: [
          pollutants.pm2_5 || 0,
          pollutants.pm10 || 0,
          pollutants.co || 0,
          pollutants.no2 || 0,
          pollutants.so2 || 0,
          pollutants.o3 || 0,
        ],
        backgroundColor: [
          "#FF6384", // PM2.5
          "#36A2EB", // PM10
          "#FFCE56", // CO
          "#4BC0C0", // NO2
          "#9966FF", // SO2
          "#FF9F40", // O3
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "80%", // Further reduce inner radius for a better ring
    plugins: {
      legend: {
        display: false, // Hide default legend
      },
      datalabels: {
        color: "white",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value, ctx) => {
          let label = ctx.chart.data.labels[ctx.dataIndex];
          return `${label}`; // Display only pollutant name
        },
        anchor: "end",
        align: "end",
        offset: 10, // Move labels outside
      },
    },
  };

  return (
    <div className="bg-[#0F172A] p-6 rounded-xl shadow-md w-full max-w-2xl mx-auto text-white mt-4 h-[550px] flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold text-gray-300 text-center mb-4">
        Pollutants Breakdown
      </h2>
      <div className="relative w-full h-[500px] flex justify-center">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-xl font-bold text-white">Pollutants</h3>
        </div>
      </div>
    </div>
  );
};

export default AirQualityPieChart;