import React from "react";
import { Thermometer } from "lucide-react"; // Import thermometer icon

const TemperatureCard = ({ temperature, unit = "°C" }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full w-24 h-24 flex items-center justify-center border-4 border-blue-500">
      <div className="flex flex-col items-center">
        <Thermometer className="w-6 h-6 text-blue-500" />
        <span className="text-lg font-bold">{temperature}{unit}</span>
      </div>
    </div>
  );
};

export default TemperatureCard;