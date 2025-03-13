import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { WiDaySunny, WiCloud, WiRain, WiSnow, WiThunderstorm } from "react-icons/wi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const getWeatherIcon = (temperature) => {
  if (temperature >= 30) return <WiDaySunny className="text-4xl text-yellow-400" />;
  if (temperature >= 20) return <WiCloud className="text-4xl text-gray-400" />;
  if (temperature >= 10) return <WiRain className="text-4xl text-blue-500" />;
  if (temperature >= 0) return <WiSnow className="text-4xl text-blue-300" />;
  return <WiThunderstorm className="text-4xl text-purple-500" />;
};

const TemperatureGraph = ({ forecast = [] }) => {
  if (!forecast || forecast.length === 0) {
    return <p className="text-white text-center">Loading data...</p>;
  }

  const labels = forecast.map((item) => item.date);
  const temperatures = forecast.map((item) => Math.round(item.temperature)); // Rounded temperatures

  const data = {
    labels,
    datasets: [
      {
        data: temperatures,
        borderColor: "#FFD700",
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "#FFD700", // Yellow dots
        pointBorderColor: "transparent", // Remove extra dots
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: { x: { display: false }, y: { display: false } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }, // Disable tooltips on hover (optional)
      datalabels: {
        align: "top",
        anchor: "end",
        color: "white",
        font: { size: 14, weight: "bold" },
        formatter: (value) => `${value}°`, // Show only rounded temperature
      },
    },
  };

  return (
    <div className="bg-[#0F172A] p-4 rounded-xl shadow-md w-full max-w-lg mx-auto text-white">
      <Line data={data} options={options} />

      <div className="flex justify-between px-6 mt-2 text-gray-400">
        {forecast.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            {getWeatherIcon(item.temperature)}
            <span className="text-xs mt-1">{item.date}</span>
            <span className="text-xs">{item.condition}</span>
            <span className="text-xs">{Math.round(item.wind_speed)} km/h</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemperatureGraph;
