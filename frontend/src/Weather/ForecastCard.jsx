import React from "react";
import ForecastDay from "./ForecastDay";

function ForecastCard({ forecastDays }) {
  return (
    <article className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">5 Days Forecast</h2>

      <div className="flex flex-col gap-4">
        {forecastDays.map((day, index) => (
          <ForecastDay
            key={index}
            day={day?.day}
            date={day?.date}
            temperature={day?.temperature}
          />
        ))}
      </div>
    </article>
  );
}

export default ForecastCard;
