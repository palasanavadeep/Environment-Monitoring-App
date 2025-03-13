from flask import Flask, jsonify
import requests
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins

# API Key for OpenWeather
AIR_QUALITY_API_KEY = os.environ.get("AIR_QUALITY_API_KEY", "707d4ece341909e0beb0997bbb0dd83c")

def fetch_data(url):
    try:
        response = requests.get(url, timeout=3)
        return response.json() if response.status_code == 200 else None
    except requests.RequestException:
        return None

def get_pollution_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    return fetch_data(url)

def get_current_location():
    try:
        ip_response = requests.get('https://ipinfo.io/json', timeout=2)
        ip_data = ip_response.json()
        loc = ip_data.get('loc')
        city = ip_data.get('city', 'Unknown Location')
        if loc:
            lat, lon = map(float, loc.split(','))
            return lat, lon, city
    except requests.RequestException:
        pass
    return None, None, 'Unknown Location'

@app.route('/', methods=['GET'])
def index():
    lat, lon, location_name = get_current_location()
    if lat is None or lon is None:
        return jsonify({"error": "Could not determine your location."})

    pollution_data = get_pollution_data(lat, lon)
    if not pollution_data:
        return jsonify({"error": "Failed to fetch pollution data."})

    pollution_info = pollution_data['list'][0]['components']
    
    results = {
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "location": location_name,
        "air_pollution": {
            "aqi": pollution_data['list'][0]['main']['aqi'],
            "pm2_5": pollution_info.get('pm2_5', "N/A"),
            "pm10": pollution_info.get('pm10', "N/A"),
            "co": pollution_info.get('co', "N/A"),
            "no2": pollution_info.get('no2', "N/A"),
            "so2": pollution_info.get('so2', "N/A"),
            "o3": pollution_info.get('o3', "N/A")
        }
    }

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=8000)