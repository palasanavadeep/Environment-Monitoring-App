import React from "react";
import {
  WiSunrise,
  WiSunset,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";

// Function to determine the weather icon based on temperature
function getWeatherIcon(temperature) {
  if (temperature >= 30) return <WiDaySunny className="text-[200px] text-9xl text-yellow-400" />;
  if (temperature >= 20) return <WiCloud className="text-9xl text-gray-400 " />;
  if (temperature >= 10) return <WiRain className="text-9xl text-blue-500" />;
  if (temperature >= 0) return <WiSnow className="text-9xl text-blue-300" />;
  return <WiThunderstorm className="text-9xl text-purple-500 shadow-lg" />;
}

function WeatherDetailsCard({
  temperature,
  feelsLike,
  weatherType,
  sunriseTime,
  sunsetTime,
  humidity,
  pressure,
  windSpeed,
  uvIndex,
}) {
  return (
    <article className="flex flex-wrap p-8 w-full bg-white rounded-2xl shadow-xl border border-gray-300 max-md:mt-10">
      
      {/* Left Side: Temperature & Feels Like */}
      <div className="flex flex-col items-center w-1/2">
        <h2 className="text-7xl font-extrabold text-gray-800 max-md:text-4xl">
          {typeof temperature === "number" ? temperature.toFixed(1) : "N/A"}°C
        </h2>
        <div className="flex gap-3 mt-3 text-gray-700 font-semibold">
          <p className="text-xl">Feels like:</p>
          <p className="text-3xl">{typeof feelsLike === "number" ? feelsLike.toFixed(1) : "N/A"}°C</p>
        </div>

        {/* Sunrise & Sunset */}
        <div className="flex gap-8 items-center mt-6">
          <div className="flex flex-col items-center">
            <WiSunrise className="text-6xl text-yellow-500" />
            <p className="text-lg mt-2 text-gray-700">Sunrise</p>
            <time className="text-lg font-semibold">{sunriseTime}</time>
          </div>
          <div className="flex flex-col items-center">
            <WiSunset className="text-6xl text-orange-500" />
            <p className="text-lg mt-2 text-gray-700">Sunset</p>
            <time className="text-lg font-semibold">{sunsetTime}</time>
          </div>
        </div>
      </div>

      {/* Right Side: Temperature Icon & Type (Full Block Occupation) */}
      <div className="flex flex-col items-center justify-center w-1/2 text-center">
        {getWeatherIcon(temperature)}
        <p className="text-3xl font-bold text-gray-800 mt-4">{weatherType}</p>
      </div>

      {/* Weather Metrics (Below Both Sections) */}
      <div className="grid grid-cols-2 gap-8 mt-6 w-full text-xl font-semibold text-gray-800">
        <div className="flex items-center gap-3">
          <WiHumidity className="text-4xl text-blue-500" />
          <p>Humidity: {humidity}%</p>
        </div>
        <div className="flex items-center gap-3">
          <WiBarometer className="text-4xl text-gray-500" />
          <p>Pressure: {pressure} hPa</p>
        </div>
        <div className="flex items-center gap-3">
          <WiStrongWind className="text-4xl text-gray-700" />
          <p>Wind Speed: {windSpeed} km/h</p>
        </div>
        <div className="flex items-center gap-3">
          <WiDaySunny className="text-4xl text-yellow-600" />
          <p>UV Index: {uvIndex}</p>
        </div>
      </div>

    </article>
  );
}

export default WeatherDetailsCard;
