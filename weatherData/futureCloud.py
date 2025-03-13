from flask import Flask
import requests
from datetime import datetime
import matplotlib.pyplot as plt
import io
import numpy as np
from collections import defaultdict
import cloudinary
import cloudinary.uploader

app = Flask(__name__)

# Replace with your actual API keys
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

def get_weather_data(lat, lon):
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(weather_url)
    return response.json() if response.status_code == 200 else None

def get_forecast_data(lat, lon):
    forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(forecast_url)
    return response.json() if response.status_code == 200 else None

def get_air_quality_data(lat, lon):
    air_quality_url = f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    response = requests.get(air_quality_url)
    return response.json() if response.status_code == 200 else None

def get_current_location():
    ip_response = requests.get('https://ipinfo.io/json')
    ip_data = ip_response.json()
    loc = ip_data.get('loc', None)
    city = ip_data.get('city', 'Unknown Location')
    if loc:
        lat, lon = loc.split(',')
        return float(lat), float(lon), city
    return None, None, None

def generate_and_upload_graph(x_labels, y_values, title, ylabel):
    plt.figure(figsize=(10, 5))
    plt.plot(x_labels, y_values, marker='o', linestyle='-')
    plt.xlabel("Day")
    plt.ylabel(ylabel)
    plt.title(title)
    plt.xticks(rotation=45)
    plt.grid()
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    
    upload_result = cloudinary.uploader.upload(img, folder="weather_graphs")
    return upload_result['secure_url']

@app.route('/', methods=['GET'])
def index():
    lat, lon, location_name = get_current_location()
    if lat is None or lon is None:
        return "Could not determine your location."

    weather_data = get_weather_data(lat, lon)
    forecast_data = get_forecast_data(lat, lon)
    air_quality_data = get_air_quality_data(lat, lon)
    
    if not weather_data or not forecast_data or not air_quality_data:
        return "Error fetching weather or air quality data."
    
    current_temp = weather_data['main']['temp']
    current_humidity = weather_data['main']['humidity']
    current_aqi = air_quality_data['list'][0]['main']['aqi']
    
    daily_temps = defaultdict(list)
    daily_humidity = defaultdict(list)
    daily_aqi = defaultdict(list)
    
    for entry in forecast_data['list']:
        date = datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d')
        daily_temps[date].append(entry['main']['temp'])
        daily_humidity[date].append(entry['main']['humidity'])
    
    for entry in air_quality_data['list']:
        date = datetime.fromtimestamp(entry['dt']).strftime('%Y-%m-%d')
        daily_aqi[date].append(entry['main']['aqi'])
    
    forecast_days = list(daily_temps.keys())[:5]
    avg_temps = [np.mean(daily_temps[day]) for day in forecast_days]
    avg_humidity = [np.mean(daily_humidity[day]) for day in forecast_days]
    avg_aqi = [np.mean(daily_aqi[day]) for day in forecast_days]
    
    temp_graph_url = generate_and_upload_graph(["Today"] + forecast_days, [current_temp] + avg_temps, "Temperature Forecast", "Temperature (°C)")
    humidity_graph_url = generate_and_upload_graph(["Today"] + forecast_days, [current_humidity] + avg_humidity, "Humidity Forecast", "Humidity (%)")
    aqi_graph_url = generate_and_upload_graph(["Today"] + forecast_days, [current_aqi] + avg_aqi, "Air Quality Index Forecast", "AQI")
    
    return {
        "location": location_name,
        "temperature_graph": temp_graph_url,
        "humidity_graph": humidity_graph_url,
        "aqi_graph": aqi_graph_url
    }

if __name__ == "__main__":
    app.run(debug=True)
