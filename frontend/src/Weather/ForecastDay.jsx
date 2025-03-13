import React from "react";
import { WiDaySunny, WiCloud, WiRain, WiSnow } from "react-icons/wi";

function getWeatherIcon(temperature) {
  if (temperature >= 30) return <WiDaySunny className="text-6xl text-yellow-400" />;
  if (temperature >= 20) return <WiCloud className="text-6xl text-gray-400" />;
  if (temperature >= 10) return <WiRain className="text-6xl text-blue-500" />;
  return <WiSnow className="text-6xl text-blue-300" />;
}

function ForecastDay({ temperature, day, date }) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow-md border border-gray-200 w-full">
      <div className="w-16">{getWeatherIcon(temperature)}</div>
      <p className="text-2xl font-semibold text-gray-900">{temperature.toFixed(0)}°C</p>
      <p className="text-lg text-gray-600">{day}{date}</p>
    </div>
  );
}

export default ForecastDay;
