from flask import Flask, jsonify, request
import requests
import concurrent.futures
from datetime import datetime
import io
import numpy as np
import cloudinary
import cloudinary.uploader
from flask_cors import CORS, cross_origin
import geocoder

import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

# API Keys
WEATHER_API_KEY = '707d4ece341909e0beb0997bbb0dd83c'
AIR_QUALITY_API_KEY = '707d4ece341909e0beb0997bbb0dd83c'
CLOUDINARY_CLOUD_NAME = 'dt2hhd4sl'
CLOUDINARY_API_KEY = '361727964994449'
CLOUDINARY_API_SECRET = 'DH0mGCfy2PTG2AT5DXpjBm2IQEE'

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

def fetch_data(url):
    """Fetch API data with timeout."""
    try:
        response = requests.get(url, timeout=3)
        return response.json() if response.status_code == 200 else None
    except requests.RequestException:
        return None

def get_weather_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    return fetch_data(url)

def get_forecast_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    return fetch_data(url)

def get_air_quality_data(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    return fetch_data(url)

def get_air_quality_forecast(lat, lon):
    url = f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    return fetch_data(url)

def get_current_location():
    """Fetch user location via IP."""
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
    return None, None, None

def generate_and_upload_graph(x_labels, y_values, title, ylabel):
    """Generate and upload a graph."""
    fig, ax = plt.subplots(figsize=(8, 4), dpi=100)
    ax.plot(x_labels, y_values, marker='o', linestyle='-', color='b')
    ax.set_xlabel("Date")
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    plt.xticks(rotation=45)
    ax.grid()
    plt.tight_layout()

    img = io.BytesIO()
    fig.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    plt.close(fig)

    upload_result = cloudinary.uploader.upload(img, folder="weather_graphs", format="png")
    return upload_result['secure_url']

def generate_pie_chart(pollutants):
    """Generate and upload a pie chart."""
    if not pollutants or sum(pollutants.values()) == 0:
        return None

    labels, values = zip(*pollutants.items())

    fig, ax = plt.subplots(figsize=(5, 5), dpi=100)
    colors = list(plt.cm.Set3(np.linspace(0, 1, len(pollutants))))
    ax.pie(values, labels=labels, autopct='%1.1f%%', startangle=140, colors=colors)
    ax.set_title("Air Pollution Distribution")
    plt.tight_layout()

    img = io.BytesIO()
    fig.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    plt.close(fig)

    upload_result = cloudinary.uploader.upload(img, folder="weather_graphs", format="png")
    return upload_result['secure_url']

@app.route('/', methods=['GET'])
@cross_origin()
def index():
    lat, lon, location_name = get_current_location()
    if lat is None or lon is None:
        return jsonify({"error": "Could not determine your location."})

    with concurrent.futures.ThreadPoolExecutor() as executor:
        weather_future = executor.submit(get_weather_data, lat, lon)
        forecast_future = executor.submit(get_forecast_data, lat, lon)
        air_quality_future = executor.submit(get_air_quality_data, lat, lon)
        air_quality_forecast_future = executor.submit(get_air_quality_forecast, lat, lon)

        weather_data = weather_future.result()
        forecast_data = forecast_future.result()
        air_quality_data = air_quality_future.result()
        air_quality_forecast_data = air_quality_forecast_future.result()

    if not weather_data or not forecast_data or not air_quality_data or not air_quality_forecast_data:
        return jsonify({"error": "Error fetching weather or air quality data."})

    now = datetime.now()

    results = {
        "timestamp": now.strftime('%Y-%m-%d %H:%M:%S'),
        "location": location_name
    }

    # Extract forecast days with dates
    forecast_list = []
    for i in range(0, len(forecast_data['list']), 8):
        entry = forecast_data['list'][i]
        date = entry['dt_txt'].split()[0]  # Extract date
        forecast_list.append({
            "date": date,
            "temperature": np.mean([e['main']['temp'] for e in forecast_data['list'][i:i+8]]),
            "humidity": np.mean([e['main']['humidity'] for e in forecast_data['list'][i:i+8]]),
            "wind_speed": np.mean([e['wind']['speed'] for e in forecast_data['list'][i:i+8]]),
            "condition": entry['weather'][0]['description'].capitalize(),
            "aqi": np.mean([e['main'].get('aqi', 0) for e in air_quality_forecast_data['list'][i:i+8]])
        })

    results["forecast"] = forecast_list

    with concurrent.futures.ThreadPoolExecutor() as executor:
        temp_future = executor.submit(generate_and_upload_graph, 
                                      ["Today"] + [f["date"] for f in forecast_list], 
                                      [weather_data['main']['temp']] + [f["temperature"] for f in forecast_list], 
                                      "Temperature Forecast", "Temperature (°C)")

        hum_future = executor.submit(generate_and_upload_graph, 
                                     ["Today"] + [f["date"] for f in forecast_list], 
                                     [weather_data['main']['humidity']] + [f["humidity"] for f in forecast_list], 
                                     "Humidity Forecast", "Humidity (%)")

        aqi_future = executor.submit(generate_and_upload_graph, 
                                     ["Today"] + [f["date"] for f in forecast_list], 
                                     [air_quality_data['list'][0]['main']['aqi']] + [f["aqi"] for f in forecast_list], 
                                     "Air Quality Index Forecast", "AQI")

        pie_future = executor.submit(generate_pie_chart, air_quality_data['list'][0]['components'])

        results["graphs"] = {
            "temperature": temp_future.result(),
            "humidity": hum_future.result(),
            "aqi": aqi_future.result(),
            "air_pollution_pie": pie_future.result()
        }

    return jsonify(results)

def get_coordinates(city_name=None):
    """Get latitude, longitude, and city name"""
    if city_name:
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={WEATHER_API_KEY}"
        response = requests.get(url).json()
        
        if response and len(response) > 0:
            return response[0]['lat'], response[0]['lon'], response[0]['name']
    else:
        g = geocoder.ip('me')
        if g.latlng:
            return g.latlng[0], g.latlng[1], g.city
    
    return None, None, None

def get_weather(lat, lon):
    """Fetch current weather data from OpenWeather API"""
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        weather_info = {
            "temperature": data['main']['temp'],
            "pressure": data['main']['pressure'],
            "humidity": data['main']['humidity'],
            "weather": data['weather'][0]['description'],
            "wind_speed": data['wind']['speed'],
            "sunrise": datetime.fromtimestamp(data['sys']['sunrise']).strftime("%H:%M"),
            "sunset": datetime.fromtimestamp(data['sys']['sunset']).strftime("%H:%M")
        }
        return weather_info
    return None

# ========================
# FLASK ROUTE: GET WEATHER
# ========================
@app.route('/current-weather', methods=['GET'])
def get_current_weather():
    """API to get current weather data"""
    city = request.args.get('city', '').strip()

    # Get location
    lat, lon, detected_city = get_coordinates(city if city else None)
    if lat is None or lon is None:
        return jsonify({"error": "Invalid city name or location detection failed"}), 400

    # Fetch weather data
    weather_data = get_weather(lat, lon)
    if weather_data is None:
        return jsonify({"error": "Failed to fetch weather data"}), 500

    # Return JSON response
    return jsonify({
        "location": detected_city,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "current_weather": weather_data
    })

if __name__ == "__main__":
    app.run(debug=True)