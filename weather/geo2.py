from flask import Flask
import requests
from datetime import datetime

app = Flask(__name__)

# Replace with your actual API keys
WEATHER_API_KEY = '707d4ece341909e0beb0997bbb0dd83c'
AIR_QUALITY_API_KEY = '707d4ece341909e0beb0997bbb0dd83c'

def get_weather_data(lat, lon):
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(weather_url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def get_air_quality_data(lat, lon):
    air_quality_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={AIR_QUALITY_API_KEY}"
    response = requests.get(air_quality_url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

def get_aqi_description(aqi):
    if aqi == 1:
        return "Good (0-50)"
    elif aqi == 2:
        return "Moderate (51-100)"
    elif aqi == 3:
        return "Unhealthy for Sensitive Groups (101-150)"
    elif aqi == 4:
        return "Unhealthy (151-200)"
    elif aqi == 5:
        return "Very Unhealthy (201-300)"
    else:
        return "Hazardous (301+)"

def get_current_location():
    # Get the user's IP address and location
    ip_response = requests.get('https://ipinfo.io/json')
    ip_data = ip_response.json()
    
    # Extract latitude, longitude, and location name
    loc = ip_data.get('loc', None)
    city = ip_data.get('city', 'Unknown Location')
    if loc:
        lat, lon = loc.split(',')
        return float(lat), float(lon), city
    return None, None, None

@app.route('/', methods=['GET'])
def index():
    # Get the current location
    lat, lon, location_name = get_current_location()
    
    if lat is not None and lon is not None:
        # Fetch weather and air quality data
        weather_data = get_weather_data(lat, lon)
        
        if weather_data:
            air_quality_data = get_air_quality_data(lat, lon)
            
            if air_quality_data:
                now = datetime.now()
                response = f"Current Date & Time: {now.strftime('%Y-%m-%d %H:%M:%S')}\n"
                response += f"Location: {location_name}\n"  # Display the location name
                response += f"Weather Details:\n"
                response += f"Temperature: {weather_data['main']['temp']}°C\n"
                response += f"Humidity: {weather_data['main']['humidity']}%\n"
                response += f"Wind Speed: {weather_data['wind']['speed']} m/s\n"
                response += f"Weather Condition: {weather_data['weather'][0]['description'].capitalize()}\n"

                aqi = air_quality_data['list'][0]['main']['aqi']
                response += f"Air Quality Index (AQI): {aqi} ({get_aqi_description(aqi)})\n"
                pollutants = air_quality_data['list'][0]['components']
                response += f"Major Pollutants:\n"
                response += f"PM2.5: {pollutants['pm2_5']}\n"
                response += f"PM10: {pollutants['pm10']}\n"
                response += f"CO: {pollutants['co']}\n"
                response += f"NO2: {pollutants['no2']}\n"

                return f"<pre>{response}</pre>"  # Return the response as plain text in a <pre> tag for formatting
            else:
                return "Error fetching air quality data."
        else:
            return "Error fetching weather data."
    else:
        return "Could not determine your location."

if __name__ == "__main__":
    app.run(debug=True)