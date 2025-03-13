import requests
from flask import Flask, request, jsonify

# ========================
# CONFIGURATION
# ========================
app = Flask(__name__)

# OpenWeather API Key (Replace with your API Key)
API_KEY = "707d4ece341909e0beb0997bbb0dd83c"

# ========================
# FLASK ROUTE: SERVE HTML WITH WEATHER MAP
# ========================
@app.route('/')
def index():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script src="https://unpkg.com/leaflet-glify/dist/leaflet-glify.min.js"></script>
        <style>
            /* General Reset */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            /* Body Styling */
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(to right, #ff7e5f, #feb47b); /* Gradient background */
                color: #fff;
                transition: all 0.3s ease;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
                flex-direction: column;
            }

            #map {
                width: 100%;
                height: 80%;
                border-radius: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
                transition: all 0.5s ease-in-out;
            }

            #search-container {
                margin-top: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.8);
                padding: 20px;
                border-radius: 25px;
                width: 80%;
                max-width: 800px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            }

            input {
                height: 50px;
                padding: 10px;
                width: 70%;
                font-size: 18px;
                border: none;
                border-radius: 10px;
                margin-right: 20px;
                background-color: rgba(255, 255, 255, 0.8);
                color: #333;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            input:focus {
                outline: none;
                border-color: #ff6347;
                background-color: rgba(255, 255, 255, 1);
                box-shadow: 0 4px 12px rgba(255, 99, 71, 0.7);
            }

            button {
                width: 180px;
                height: 50px;
                padding: 12px;
                font-size: 20px;
                cursor: pointer;
                font-weight: bold;
                background-color: #ff6347;
                color: white;
                border: none;
                border-radius: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            }

            button:hover {
                background-color: #e55347;
                box-shadow: 0 4px 12px rgba(255, 99, 71, 0.6);
            }

            button:active {
                background-color: #cc2f27;
            }

            /* Popup content styling */
            .leaflet-popup-content {
                font-size: 16px;
                font-weight: bold;
                color: #333;
                background-color: #fff;
                border-radius: 10px;
                padding: 15px;
                width: 250px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .leaflet-popup-content b {
                color: #ff6347;
            }

            .leaflet-popup-content span {
                display: block;
                margin-top: 10px;
                font-size: 14px;
            }

            /* Media Queries */
            @media (max-width: 1200px) {
                #map {
                    height: 70%;
                }
            }

            @media (max-width: 768px) {
                body {
                    flex-direction: column;
                    padding: 20px;
                }

                input {
                    width: 60%;
                    font-size: 16px;
                }

                button {
                    width: 160px;
                    font-size: 18px;
                }

                #search-container {
                    flex-direction: column;
                }
            }

            @media (max-width: 480px) {
                body {
                    padding: 10px;
                }

                input {
                    width: 80%;
                    font-size: 14px;
                }

                button {
                    width: 100%;
                    font-size: 16px;
                }

                #map {
                    height: 60%;
                }
            }

        </style>
    </head>
    <body>
        <div id="search-container">
            <input type="text" id="location-input" placeholder="Enter city name...">
            <button onclick="searchLocation()">Search</button>
        </div>
        <div id="map"></div>

        <script>
            var map = L.map('map', {
                center: [20, 78],
                zoom: 5,
                zoomControl: true,
                layers: [L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                    maxZoom: 18
                })]
            });

            // High-resolution tile layer for better clarity
            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(map);

            var marker = null; // Store marker reference

            // Function to update marker with full weather info
            function updateMarker(lat, lon, location, weatherInfo) {
                if (marker) {
                    map.removeLayer(marker); // Remove existing marker
                }

                marker = L.marker([lat, lon]).addTo(map);
                marker.bindPopup(`<div class="popup-header">${location}</div><br>${weatherInfo}`).openPopup();
                map.setView([lat, lon], 10); // Zoom to the location
            }

            // Click Event to Get Full Weather Report
            map.on('click', function(e) {
                var lat = e.latlng.lat;
                var lon = e.latlng.lng;

                fetch(`/weather?lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            var weatherInfo = `🌡 Temperature: ${data.temperature}°C<br>
                                              💨 Wind: ${data.wind} m/s<br>
                                              🌫 Humidity: ${data.humidity}%<br>
                                              🌅 Sunrise: ${new Date(data.sunrise * 1000).toLocaleTimeString()}<br>
                                              🌇 Sunset: ${new Date(data.sunset * 1000).toLocaleTimeString()}<br>
                                              ☁️ ${data.description}`;
                            updateMarker(lat, lon, data.location, weatherInfo);
                        }
                    })
                    .catch(error => console.error("Error fetching weather data:", error));
            });

            // Search location function
            function searchLocation() {
                var city = document.getElementById("location-input").value.trim();
                if (!city) {
                    alert("Please enter a city name.");
                    return;
                }

                fetch(`/search?city=${city}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.error) {
                            alert(data.error);
                        } else {
                            var weatherInfo = `🌡 Temperature: ${data.temperature}°C<br>
                                              💨 Wind: ${data.wind} m/s<br>
                                              🌫 Humidity: ${data.humidity}%<br>
                                              🌅 Sunrise: ${new Date(data.sunrise * 1000).toLocaleTimeString()}<br>
                                              🌇 Sunset: ${new Date(data.sunset * 1000).toLocaleTimeString()}<br>
                                              ☁️ ${data.description}`;
                            updateMarker(data.lat, data.lon, data.location, weatherInfo);
                        }
                    })
                    .catch(error => console.error("Error searching location:", error));
            }

            // Add 3D terrain effect to map with Leaflet.glify
            var glifyLayer = L.glify.layer({
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                elevation: true,
                height: 250, // Set height for 3D terrain
            }).addTo(map);
        </script>
    </body>
    </html>
    """

# ========================
# FLASK ROUTE: SEARCH WEATHER BY CITY
# ========================
@app.route('/search')
def search_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City name is required"}), 400

    weather_url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    weather_response = requests.get(weather_url)

    if weather_response.status_code == 200:
        weather_data = weather_response.json()
        return jsonify({
            "location": weather_data["name"],
            "lat": weather_data["coord"]["lat"],
            "lon": weather_data["coord"]["lon"],
            "temperature": weather_data["main"]["temp"],
            "wind": weather_data["wind"]["speed"],
            "humidity": weather_data["main"]["humidity"],
            "sunrise": weather_data["sys"]["sunrise"],
            "sunset": weather_data["sys"]["sunset"],
            "description": weather_data["weather"][0]["description"]
        })
    else:
        return jsonify({"error": "Failed to fetch weather data"}), 500

# ========================
# FLASK ROUTE: WEATHER BY COORDINATES
# ========================
@app.route('/weather')
def get_weather_by_coordinates():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    weather_response = requests.get(weather_url)

    if weather_response.status_code == 200:
        weather_data = weather_response.json()
        return jsonify({
            "location": weather_data["name"],
            "lat": weather_data["coord"]["lat"],
            "lon": weather_data["coord"]["lon"],
            "temperature": weather_data["main"]["temp"],
            "wind": weather_data["wind"]["speed"],
            "humidity": weather_data["main"]["humidity"],
            "sunrise": weather_data["sys"]["sunrise"],
            "sunset": weather_data["sys"]["sunset"],
            "description": weather_data["weather"][0]["description"]
        })
    else:
        return jsonify({"error": "Failed to fetch weather data"}), 500

# ========================
# RUN THE FLASK SERVER
# ========================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)