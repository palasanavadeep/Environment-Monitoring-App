import React, { useState, useRef, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Context } from "../components/ContextProvider.jsx";

const levels = [
  { id: "L1", points: 2050, unlocked: false },
  { id: "L2", points: 1050, unlocked: false },
  { id: "L3", points: 2050, unlocked: false },
  { id: "L4", points: 2050, unlocked: false },
  { id: "L5", points: 2050, unlocked: false },
  { id: "L6", points: 2050, unlocked: false },
  { id: "L7", points: 2050, unlocked: false },
];

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const daysInMonth = currentDate.daysInMonth();
  const today = dayjs().date();
  const scrollRef = useRef(null);
  const [missionDate, setMissionDate] = useState(dayjs().date(1));
  const [missions, setMissions] = useState([]);
  const { user } = useContext(Context);

  // Levels unlocking logic
  useEffect(() => {
    const updatedLevels = levels.map((level, index) => {
      if (user?.user?.level > index) {
        level.unlocked = true;
      }
      return level;
    });
    // Update levels after user data is fetched or changed
    levels.splice(0, levels.length, ...updatedLevels);
  }, [user?.user?.level]);

  // Fetch missions based on missionDate or currentDate
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/getMissionsByDate?date=${currentDate.toISOString()}`
        );
        setMissions(response.data);
      } catch (error) {
        console.error("Error fetching missions:", error);
      }
    };
    fetchMissions();
  }, [currentDate]);

  // Days array to render the days of the month
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Handle date click to fetch missions
  const handleDateClick = (day) => {
    const selectedDate = currentDate.date(day).startOf("day");
    setCurrentDate(selectedDate); // Update the current date
  };

  return (
    <div className="p-6 bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] to-[#D6E6F2] min-h-screen">
      {/* Dashboard UI */}
      <div className="p-4 bg-white shadow-lg rounded-xl mb-6 flex justify-between items-center gap-4">
        {/* Points Section */}
        <div className="bg-green-100 p-4 rounded-xl w-1/3 shadow-md text-center transform hover:scale-105 transition-all">
          <h2 className="text-md font-semibold text-gray-700">Points Earned</h2>
          <p className="text-3xl font-extrabold text-green-700">
            {user?.user?.totalPoints || 10}
          </p>
          <button className="mt-2 px-4 py-2 text-sm bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all">
            Redeem
          </button>
        </div>

        {/* Levels Section */}
        <div className="w-1/3 flex items-center gap-2 overflow-x-auto scrollbar-hide p-2 bg-gray-100 rounded-xl shadow-md">
          {levels.map((level, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 hover:scale-110 shadow-md ${
                level.unlocked ? "text-green-600 bg-green-50" : "text-gray-400 bg-gray-200"
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-sm ${
                  level.unlocked ? "border-green-600 bg-green-100" : "border-gray-300 bg-gray-200"
                }`}
              >
                {level.id}
              </div>
              <p className="text-xs font-semibold mt-1">{level.points} Pts</p>
            </div>
          ))}
        </div>

        {/* Circular Progress */}
        <div className="text-center w-1/3">
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="text-gray-300"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="transparent"
                r="15.9155"
                cx="18"
                cy="18"
              ></circle>
              <circle
                className="text-green-500"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeDasharray="60, 100"
                stroke="currentColor"
                fill="transparent"
                r="15.9155"
                cx="18"
                cy="18"
              ></circle>
            </svg>
            <div className="absolute text-3xl font-bold text-green-700">
              {user?.user?.crntPoints || 0}
            </div>
          </div>
          <p className="text-gray-600 text-xs">Total Points</p>
          <p className="text-xs text-gray-500">{user?.user?.crntPoints || 0} Pts Away</p>
        </div>
      </div>

      {/* Days List */}
      <div className="relative w-full flex items-center justify-center">
        {/* Left Scroll Button */}
        <button className="absolute left-0 z-10 p-2 bg-gray-200 shadow rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex space-x-4 p-4 bg-transparent rounded-lg overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {daysArray.map((day) => {
            const dayDate = currentDate.date(day); // Get the date object for the day
            const isFuture = dayDate.isAfter(dayjs(), "day"); // Check if the day is in the future

            return (
              <div
                key={day}
                onClick={!isFuture ? () => handleDateClick(day) : null} // Only allow click on past/current days
                className={`flex flex-col items-center w-12 h-16 p-3 rounded-lg shadow-md text-center cursor-pointer bg-white transition-all duration-300 hover:bg-green-100 ${
                  day === today ? "border-2 border-green-500 text-green-500" : "border border-gray-300"
                } ${isFuture ? "opacity-50 pointer-events-none" : ""}`} // Lock future dates
              >
                {isFuture ? (
                  <span className="text-xl text-gray-400">🔒</span> // Lock symbol for future dates
                ) : (
                  <>
                    <span className="text-lg font-bold">{day}</span>
                    <span className="text-xs">{dayDate.format("ddd")}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        <button className="absolute right-0 z-10 p-2 bg-gray-200 shadow rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Mission Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {missions.map((mission) => (
          <MissionCard key={mission._id} mission={mission} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

const MissionCard = ({ mission }) => {
  const { title, description, points, coins, date } = mission;

  // Format the mission date
  const missionDate = dayjs(date).format('YYYY-MM-DD HH:mm');

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl mb-6 flex flex-col items-center w-80">
      {/* Mission Title */}
      <h3 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h3>

      {/* Mission Description */}
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Mission Points and Coins */}
      <div className="flex justify-between w-full mb-4">
        <div className="text-lg font-semibold text-green-600">Points: {points}</div>
        <div className="text-lg font-semibold text-yellow-500">Coins: {coins}</div>
      </div>

      {/* Mission Date */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="font-semibold">Date:</span> {missionDate}
      </div>

      {/* Action Button */}
      <button className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all">
        Start Mission
      </button>
    </div>
  );
};
