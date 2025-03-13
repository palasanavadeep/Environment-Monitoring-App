import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Context } from "./ContextProvider.jsx";
import { useContext } from "react";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(Context);

  return (
    <header className="bg-[#546d82] text-white p-auto  shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo & Title */}
        <div className="flex items-center ">
          <img
            src="../../public/Logo.png" 
            alt="logo"
            className="w-20 h-20"
          />
          <span className="text-xl font-semibold hidden sm:block">
            EcoPlanet
          </span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Type to search..."
            className="p-2 rounded-lg border border-gray-300 min-w-[350px] focus:outline-none"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <div className="md:flex space-between items-center ">
          <nav
            className={`sm:flex sm:items-center sm:space-x-6 ${
              isOpen ? "block" : "hidden"
            } absolute sm:static bg-blue-600 sm:bg-transparent w-full left-0 top-16 p-6 sm:p-0 shadow-lg sm:shadow-none transition-all`}
          >
            <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <li key="Home">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-lg font-semibold transition duration-300 ${
                      isActive
                        ? "text-yellow-300 underline"
                        : "hover:text-gray-200"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>
              {[
                "Blogs",
                "Missions",
                "Communities",
                "Weather",
                "Profile",
              ].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      `text-lg font-semibold transition duration-300 ${
                        isActive
                          ? "text-yellow-300 underline"
                          : "hover:text-gray-200"
                      }`
                    }
                  >
                    {item}
                  </NavLink>
                </li>
              ))}

              {/* Authentication Links */}

              <li>
                <NavLink
                  to="/signin"
                  className={({ isActive }) =>
                    `text-lg font-semibold border px-4 py-2 rounded-lg transition duration-300 
                  ${user.isLoggedIn ? "hidden" : ""}
                  ${
                    isActive
                      ? "bg-white text-blue-600 border-yellow-300"
                      : "border-white hover:bg-white hover:text-blue-600"
                  }`
                  }
                >
                  Sign In
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
