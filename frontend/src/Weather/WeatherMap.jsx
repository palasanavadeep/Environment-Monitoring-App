import React from "react";

function WeatherMap({ mapUrl }) {
  return (
    <figure className="w-full">
      <img
        src={mapUrl}
        alt="Weather map"
        className="object-contain grow w-full aspect-[2.38] rounded-[30px] shadow-[10px_10px_4px_rgba(0,0,0,0.5)] max-md:mt-10 max-md:max-w-full"
      />
    </figure>
  );
}

export default WeatherMap;
