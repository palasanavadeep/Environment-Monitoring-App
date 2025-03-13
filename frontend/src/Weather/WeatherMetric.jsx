import React from "react";

function WeatherMetric({
  icon,
  value,
  label,
  iconClasses = "",
  valueClasses = "",
  labelClasses = "",
}) {
  return (
    <>
      <img src={icon} alt={`${label} icon`} className={iconClasses} />
      <p className={`self-center mt-2.5 ${valueClasses}`}>{value}</p>
      <p className={`mt-7 text-base font-medium ${labelClasses}`}>{label}</p>
    </>
  );
}

export default WeatherMetric;
