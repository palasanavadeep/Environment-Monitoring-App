import React, { useEffect, useState } from "react";

function DateTimeCard() {
  const [city, setCity] = useState("Loading...");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then((response) => response.json())
      .then((data) => {
        if (data.location) {
          setCity(data.location);
        }
        const now = new Date();
        setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })); 
        setDate(now.toDateString());
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <article className="flex flex-col justify-center items-center p-8 w-full max-w-lg bg-white rounded-2xl shadow-lg text-gray-900 border border-gray-300">
      <h2 className="text-3xl text-gray-700">{city}</h2>
      <time className="mt-4 text-6xl text-gray-900 font-extrabold">{time}</time> 
      <time className="mt-2 text-lg text-gray-500">{date}</time>
    </article>
  );
}

export default DateTimeCard;
