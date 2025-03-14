import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Globe, FileText, File } from "lucide-react"; // Import icons for categories
import { Context } from "./ContextProvider.jsx";
import { useContext } from "react";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [searchResults, setSearchResults] = useState({}); // State for API results grouped by category
  const [loading, setLoading] = useState(false); // State to show loading spinner
  const { user } = useContext(Context);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update search query
  };

  // Fetch search results from the API
  const fetchSearchResults = async () => {
    if (searchQuery.trim() === "") {
      setSearchResults({}); // Clear search results if the query is empty
      return;
    }

    setLoading(true); // Set loading to true when initiating the request
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/search/${searchQuery}` // Replace with your API endpoint
      );
      setSearchResults(response.data); // Set search results from the response
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  // Trigger API request when searchQuery changes
  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]); // Re-run the effect whenever searchQuery changes

  // Handle item selection and reset search query
  const handleSelection = () => {
    setSearchQuery(""); // Reset the search query after selecting an item
  };

  return (
    <header className="bg-[#546d82] text-white p-auto shadow-lg">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo & Title */}
        <div className="flex items-center">
          <img
            src="../../public/Logo.png"
            alt="logo"
            className="w-20 h-20"
          />
          <span className="text-xl font-semibold hidden sm:block">EcoPlanet</span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery} // Bind the input value to state
            onChange={handleSearchChange} // Update the state on input change
            placeholder="Type to search..."
            className="p-2 rounded-lg border border-gray-300 min-w-[350px] focus:outline-none"
          />

          {/* Search Results */}
          {searchQuery && !loading && (
            <div className="absolute w-full bg-white text-black shadow-lg rounded-lg mt-2 z-40">
              {/* Users Results */}
              {/* {searchResults.users && searchResults.users.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold p-2 bg-gray-200">Users</h3>
                  <ul>
                    {searchResults.users.map((user) => (
                      <li key={user._id}>
                        <NavLink
                          to={`/user/${user._id}`} // Navigate to the user profile
                          className="block text-lg font-semibold p-2 hover:bg-gray-100 transition duration-300"
                          onClick={handleSelection} // Reset search query on selection
                        >
                          <User size={18} className="inline mr-2" />
                          {user.username}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}

              {/* Communities Results */}
              {searchResults.communities && searchResults.communities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold p-2 bg-gray-200">Communities</h3>
                  <ul>
                    {searchResults.communities.map((community) => (
                      <li key={community._id}>
                        <NavLink
                          to={`/community/${community._id}`} // Navigate to the community page
                          className="block text-lg font-semibold p-2 hover:bg-gray-100 transition duration-300"
                          onClick={handleSelection} // Reset search query on selection
                        >
                          <Globe size={18} className="inline mr-2" />
                          {community.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Blogs Results */}
              {searchResults.blogs && searchResults.blogs.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold p-2 bg-gray-200">Blogs</h3>
                  <ul>
                    {searchResults.blogs.map((blog) => (
                      <li key={blog._id}>
                        <NavLink
                          to={`/blogs/${blog._id}`} // Navigate to the blog page
                          className="block text-lg font-semibold p-2 hover:bg-gray-100 transition duration-300 overflow-hidden"
                          onClick={handleSelection} // Reset search query on selection
                        >
                          <FileText size={18} className="inline mr-2" />
                          {blog.title.toString().split(" ").slice(0, 4).join(" ")}...
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Posts Results */}
              {/* {searchResults.posts && searchResults.posts.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold p-2 bg-gray-200">Posts</h3>
                  <ul>
                    {searchResults.posts.map((post) => (
                      <li key={post._id}>
                        <NavLink
                          to={`/post/${post._id}`} // Navigate to the post page
                          className="block text-lg font-semibold p-2 hover:bg-gray-100 transition duration-300"
                          onClick={handleSelection} // Reset search query on selection
                        >
                          <File size={18} className="inline mr-2" />
                          {post.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )} */}
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute w-full bg-white text-black shadow-lg rounded-lg mt-2 z-10 p-2">
              <span>Loading...</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <div className="md:flex space-between items-center">
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
              {["Blogs", "Missions", "Communities", "Weather", "Profile"].map(
                (item) => (
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
                )
              )}
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
