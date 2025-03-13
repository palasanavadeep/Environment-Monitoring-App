import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { Context } from "../components/ContextProvider";

const SignInPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const navigate = useNavigate();
  const { user, setUser } = useContext(Context);


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/signin`, { email, password },{ withCredentials: true })
        .then((res) => {
          console.log(res.data);
          console.log("User logged in successfully");
          
          setUser({ user: res.data || null , isLoggedIn: true });
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          window.alert("Something went wrong. Please try again.");
        });
    } else {
      // signup for user registration
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/signup`, {
          username,
          email,
          password,
        },{ withCredentials: true })
        .then((res) => {
          console.log(res.data);
          setUser({ user : res.data || null , isLoggedIn: true });
          // navigate("/");
          setIsLogin(true);
        })
        .catch((err) => {
          console.log(err);
          window.alert("Signup failed. Please try again.");
        });
    }
  };

  // Toggle between login and signup and reset form fields
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setUsername(""); // Reset username
    setEmail(""); // Reset email
    setPassword(""); // Reset password
    setShowPassword(false); // Reset password visibility
  };

  // Handle "Forgot Password" click
  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
    // Add your forgot password logic here (e.g., redirect to a forgot password page)
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-[#D8F3DC] via-[#B7E4C7] via-[#A3D9C6] via-[#BFDCE5] to-[#D6E6F2]">
      {/* Overlay Container */}
      <div className="flex items-center justify-center w-full h-full p-4">
        {/* Combined Container for Login/Signup Box and Logo */}
        <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg relative z-20 w-full max-w-4xl">
          {/* Login/Signup Box */}
          <div
            className="bg-white p-6 w-full md:w-1/2 h-auto md:h-[500px] border-r border-gray-200"
            style={{
              boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Form Title */}
            <h1 className="text-2xl font-bold mb-6 text-center">
              🌿 {isLogin ? "Login" : "Signup"}
            </h1>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Username Field (Only for Signup) */}
              {!isLogin && (
                <div className="input-group mb-3">
                  <label
                    htmlFor="username"
                    className="block text-gray-600 mb-1 text-sm"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    className="w-full p-2 bg-gray-100 rounded-lg text-black focus:outline-none border border-gray-300 text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="input-group mb-3">
                <label
                  htmlFor="email"
                  className="block text-gray-600 mb-1 text-sm"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="jeffbezos@mail.com"
                  className="w-full p-2 bg-gray-100 rounded-lg text-black focus:outline-none border border-gray-300 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="input-group mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-600 mb-1 text-sm"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    id="password"
                    placeholder="Enter your password"
                    className="w-full p-2 bg-gray-100 rounded-lg text-black focus:outline-none border border-gray-300 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } absolute right-3 top-3 text-gray-500 cursor-pointer`}
                    onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                  ></i>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg mb-3 hover:bg-green-600 text-sm"
              >
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>

            {/* Toggle Link and Forgot Password */}
            <div className="text-center space-y-2">
              {/* Toggle Link */}
              <p className="text-gray-600 text-sm">
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <a
                  href="#"
                  className="text-green-500 hover:text-green-600"
                  onClick={toggleForm} // Use toggleForm to reset fields
                >
                  {isLogin ? "Sign up" : "Log in"}
                </a>
              </p>

              {/* Forgot Password Link (Only for Login) */}
              {isLogin && (
                <p className="text-gray-600 text-sm">
                  <a
                    href="#"
                    className="text-green-500 hover:text-green-600"
                    onClick={handleForgotPassword} // Handle forgot password
                  >
                    Forgot Password?
                  </a>
                </p>
              )}
            </div>

            {/* Social Login Buttons */}
            <div className="social-btn space-y-3 mt-4">
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 flex items-center justify-center border border-gray-300 text-sm">
                <i className="fab fa-google mr-2"></i> Sign in with Google
              </button>
              <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 flex items-center justify-center border border-gray-300 text-sm">
                <i className="fab fa-facebook-f mr-2"></i> Sign in with Facebook
              </button>
            </div>
          </div>

          {/* Logo Section with Background Image */}
          <div className="bg-cover bg-center w-full md:w-1/2 h-[300px] md:h-[500px] relative">
            {/* Pseudo-element for Transparent Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: "url('../public/logobkgd.jpg')" }}
            ></div>

            {/* Logo */}
            <div className="flex items-center justify-center h-full relative z-10">
              <img
                src="../public/Logo.png"
                alt="Logo"
                className="w-48 h-48 md:w-64 md:h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
