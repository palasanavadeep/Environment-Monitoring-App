import React from 'react'

function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
          {/* Left Side - App Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-semibold mb-2">EcoMonitor</h2>
            <p className="text-sm text-gray-400">Your trusted solution for environmental monitoring</p>
          </div>

          {/* Center - Useful Links */}
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-4 sm:justify-center items-center sm:items-start">
            <a href="/about" className="text-sm hover:text-green-400 transition duration-300">About Us</a>
            <a href="/terms" className="text-sm hover:text-green-400 transition duration-300">Terms & Conditions</a>
            <a href="/privacy" className="text-sm hover:text-green-400 transition duration-300">Privacy Policy</a>
            <a href="/contact" className="text-sm hover:text-green-400 transition duration-300">Contact</a>
          </div>

          {/* Right Side - Social Media Links */}
          <div className="flex gap-4 sm:gap-6 justify-center items-center">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook text-2xl hover:text-green-400 transition duration-300"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter text-2xl hover:text-green-400 transition duration-300"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin text-2xl hover:text-green-400 transition duration-300"></i>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400 mt-6">
          <p>© 2025 EcoMonitor. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
    )
}

export default Footer
