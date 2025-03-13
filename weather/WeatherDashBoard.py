import requests
import json
from flask import Flask, request, jsonify
from datetime import datetime
import geocoder
app = Flask(__name__)
API_KEY = "707d4ece341909e0beb0997bbb0dd83c"
def get_coordinates(city_name=None):
    """Get latitude, longitude, and city name"""
    if city_name:
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={API_KEY}"
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
    url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
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
@app.route('/weather', methods=['GET'])
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)