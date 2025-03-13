import BlogCommunityGrid from "./BlogCommunityGrid";

export default function BackgroundWithImage() {
  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2]"></div>

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="../../public/homeBackground.jpeg"
            alt="Background"
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Curved Transition with Gradient Fill */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <svg
            className="w-full h-[30vh]"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D8F3DC" />
                <stop offset="25%" stopColor="#B7E4C7" />
                <stop offset="50%" stopColor="#A3D9C6" />
                <stop offset="75%" stopColor="#BFDCE5" />
                <stop offset="100%" stopColor="#D6E6F2" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M0,192 C360,96 1080,96 1440,192 L1440,320 L0,320 Z"
            />
          </svg>
        </div>

        {/* Heading & Subtitle */}
        <div className="absolute top-[40%] w-full text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 drop-shadow-lg animate-fadeIn">
            Weather Explorer
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mt-3 animate-fadeIn delay-200">
            Discover real-time weather updates for any location worldwide.
          </p>
        </div>

        {/* Search Bar */}
        <div className="absolute top-[55%] w-full flex justify-center animate-slideUp delay-300">
          <div className="relative w-3/4 md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search for a location..."
              className="w-full p-4 pl-5 pr-12 text-lg rounded-full shadow-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
            <button className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition-all duration-300">
              🔍
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
