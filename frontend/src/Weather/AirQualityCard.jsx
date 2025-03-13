import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSmog, FaWind, FaCloud, FaBiohazard } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import AirQualityPieChart from "./AirQualityPieChart"; // Import Pie Chart Component

const AirQualityCard = ({setAirPollutants}) => {
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/") // Flask API URL
      .then((response) => {
        if (response.data && response.data.air_pollution) {
          setAirQuality(response.data.air_pollution);
          setAirPollutants(response.data.air_pollution);
        } else {
          setError("No valid air quality data received.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch air quality data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">{error}</p>;
  if (!airQuality) return <p className="text-center">No data available</p>;

  const getAQIStatus = (aqi) => {
    if (aqi === 1) return { label: "Good", color: "bg-green-500" };
    if (aqi === 2) return { label: "Moderate", color: "bg-yellow-500" };
    if (aqi === 3) return { label: "Unhealthy for Sensitive Groups", color: "bg-orange-500" };
    if (aqi === 4) return { label: "Unhealthy", color: "bg-red-500" };
    if (aqi === 5) return { label: "Very Unhealthy", color: "bg-purple-500" };
    return { label: "Hazardous", color: "bg-maroon-700" };
  };

  const { label, color } = airQuality && airQuality.aqi ? getAQIStatus(airQuality.aqi) : { label: "Unknown", color: "bg-gray-500" };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-300">
      <div className={`p-6 rounded-lg ${color} text-white flex flex-col items-center shadow-md`}>
        <div className="text-2xl font-bold flex items-center gap-2">
          <FaSmog size={28} /> {label}
        </div>
        <div className="text-5xl font-extrabold">{airQuality.aqi} US AQI</div>
        <div className="text-md mt-2">Main pollutant: PM2.5</div>
      </div>

      {/* Pollutants Section */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-lg">
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <FaCloud size={20} /> PM2.5: {airQuality.pm2_5 ?? "N/A"} µg/m³
        </div>
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <FaCloud size={20} /> PM10: {airQuality.pm10 ?? "N/A"} µg/m³
        </div>
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <FaWind size={20} /> CO: {airQuality.co ?? "N/A"} ppm
        </div>
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <FaBiohazard size={20} /> NO2: {airQuality.no2 ?? "N/A"} ppb
        </div>
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <FaBiohazard size={20} /> SO2: {airQuality.so2 ?? "N/A"} ppb
        </div>
        <div className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg shadow-sm">
          <BsSunFill size={20} /> O3: {airQuality.o3 ?? "N/A"} ppb
        </div>
      </div>

      {/* <AirQualityPieChart pollutants={airQuality} /> */}
    </div>
  );
};

export default AirQualityCard;
