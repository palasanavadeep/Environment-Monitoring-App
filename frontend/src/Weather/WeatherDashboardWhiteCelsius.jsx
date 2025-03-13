import React, { useEffect, useState } from "react";
import DateTimeCard from "./DateTimeCard";
import WeatherDetailsCard from "./WeatherDetailsCard";
import ForecastCard from "./ForecastCard";
import AirQualityCard from "./AirQualityCard";
import PollutantHealthCard from "./PollutantHealthCard";
import TemperatureGraphs from "./TemperatureGraphs";
import AirQualityPieChart from "./AirQualityPieChart";

function WeatherDashboardWhiteCelsius() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [airPollutants, setAirPollutants] = useState(null);

  useEffect(() => {
    try {
      // forecast data
      fetch("http://127.0.0.1:5000")
        .then((response) => response.json())
        .then(async (data) => {
          if (!data.error) {
            setWeatherData(data);
            // current weather data
            await fetch("http://127.0.0.1:5000/current-weather")
              .then((response) => response.json())
              .then((data) => {
                if (!data.error) {
                  setCurrentWeather(data);
                } else {
                  console.error("API Error {Current Weather}:", data.error);
                }
              })
              .catch((error) => console.error("Error fetching current weather data:", error))
          } else {
            console.error("API Error:", data.error);
          }
        })
        .catch((error) => console.error("Error fetching weather data:", error))
    } catch (error) {
      console.error("Error fetching weather data:", error)
    }
    finally {
      setLoading(false);
    }
  }, []);

  if (loading || !weatherData || !currentWeather) {
    return <p className="text-center text-xl font-bold">Loading weather data...</p>;
  }

  const { location, timestamp, forecast } = weatherData;

  return (!loading && weatherData && currentWeather) ? (
    <section className="overflow-hidden px-20 py-16 max-md:px-5">
      {/* Grid Layout with 2 Columns & 3 Rows */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {/* Column 1 (Left Side) */}
        <div className="flex flex-col gap-5 items-center h-full">
          {/* Row 1: Date & Time */}
          <DateTimeCard city={location} className="h-auto" />
          {/* Row 2: Forecast (Starts After Date & Time) */}
          <ForecastCard className="h-auto" forecastDays={forecast} />
          <TemperatureGraphs forecast={forecast}/>
        </div>

        {/* Column 2 (Right Side) */}
        <div className="h-full flex flex-col gap-5">
          {/* Row 1: Weather Details */}
          <WeatherDetailsCard
            temperature={currentWeather?.current_weather.temperature ?? 0}
            feelsLike={currentWeather?.current_weather.temperature ?? 0}
            weatherType={weatherData.forecast[0].condition ?? "Unknown"}
            sunriseTime={currentWeather?.current_weather.sunrise ?? "06:00 AM"}
            sunsetTime={currentWeather?.current_weather.sunset ?? "07:00 PM"}
            humidity={currentWeather?.current_weather.humidity?.toFixed(1) ?? "N/A"}
            pressure={currentWeather?.current_weather.pressure ?? "N/A"}
            windSpeed={currentWeather?.current_weather.wind_speed?.toFixed(1) ?? "N/A"}
            uvIndex="11"
          />
          {/* Row 2: Air Quality Card */}
          <AirQualityCard setAirPollutants={setAirPollutants}/>
           <AirQualityPieChart pollutants={airPollutants} />
          {/* Row 3: Pollution Health Effects Card */}
          <PollutantHealthCard />
        </div>
      </div>
    </section>
  ) : <h1>Loading weather data ....</h1>
}

export default WeatherDashboardWhiteCelsius;
