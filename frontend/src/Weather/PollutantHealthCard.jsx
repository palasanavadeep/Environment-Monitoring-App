import React from "react";
import { FaCloud, FaWind, FaBiohazard } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const PollutantHealthCard = () => {
  const pollutants = [
    { name: "PM2.5", effect: "Can cause respiratory issues and cardiovascular diseases.", icon: <FaCloud size={24} /> },
    { name: "PM10", effect: "May lead to lung irritation and worsen asthma symptoms.", icon: <FaCloud size={24} /> },
    { name: "CO", effect: "Reduces oxygen delivery to organs, causing dizziness and fatigue.", icon: <FaWind size={24} /> },
    { name: "NO2", effect: "Can inflame the airways and reduce lung function.", icon: <FaBiohazard size={24} /> },
    { name: "SO2", effect: "Causes throat irritation and aggravates lung diseases.", icon: <FaBiohazard size={24} /> },
    { name: "O3", effect: "Leads to shortness of breath and worsens lung conditions.", icon: <BsSunFill size={24} /> }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 rounded-xl shadow-2xl bg-white text-gray-900 border border-gray-300 h-auto">
      <h2 className="text-xl font-bold text-center mb-4">Pollutant Health Effects</h2>
      <div className="grid grid-cols-1 gap-4">
        {pollutants.map((pollutant, index) => (
          <div key={index} className="flex items-center gap-4 bg-gray-200 p-4 rounded-lg shadow-md">
            {pollutant.icon}
            <div>
              <h3 className="font-bold text-lg">{pollutant.name}</h3>
              <p className="text-sm text-gray-700">{pollutant.effect}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollutantHealthCard;
