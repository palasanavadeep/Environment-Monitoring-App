import requests
import matplotlib.pyplot as plt
import numpy as np
import cloudinary
import cloudinary.uploader
import cloudinary.api
import geocoder
from flask import Flask, request, jsonify
import io

# ========================
# CONFIGURATION
# ========================
app = Flask(__name__)

# API Keys
API_KEY = "707d4ece341909e0beb0997bbb0dd83c"
CLOUDINARY_CLOUD_NAME = "dt2hhd4sl"
CLOUDINARY_API_KEY = "361727964994449"
CLOUDINARY_API_SECRET = "DH0mGCfy2PTG2AT5DXpjBm2IQEE"

# Cloudinary Configuration
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

# ========================
# GET LOCATION FUNCTION
# ========================
def get_coordinates(city_name=None):
    """Get latitude and longitude from OpenWeather API or use IP-based geolocation"""
    if city_name:
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={city_name}&limit=1&appid={API_KEY}"
        response = requests.get(url).json()
        
        if response and len(response) > 0:
            return response[0]['lat'], response[0]['lon'], city_name
        return None, None, None

    else:
        g = geocoder.ip('me')
        if g.latlng:
            return g.latlng[0], g.latlng[1], g.city
        else:
            return None, None, None

# ========================
# GET POLLUTION DATA FUNCTION
# ========================
def get_pollution(lat, lon):
    """Fetch air pollution data from OpenWeather API"""
    url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    return None

# ========================
# PLOT PIE CHART FUNCTION
# ========================
def generate_pie_chart(pollution_data, city):
    """Generate and save a stylish pie chart of pollution levels"""
    pollutants = ['co', 'no', 'no2', 'o3', 'so2', 'pm2_5', 'pm10', 'nh3']
    pollution_levels = [pollution_data['components'].get(p, 0) for p in pollutants]

    colors = ["#8a2be2", "#ff4500", "#4682b4", "#ff1493", "#00fa9a", "#9400d3", "#ff6347", "#00ced1"]

    plt.figure(figsize=(8, 6), facecolor="black")
    plt.pie(
        pollution_levels, labels=[p.upper() for p in pollutants],
        autopct='%1.1f%%', colors=colors, textprops={'color': "white"},
        wedgeprops={'edgecolor': "black"}
    )

    plt.title(f"Pollution Levels in {city}", color="white", fontsize=14, fontweight="bold")

    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png', facecolor="black", bbox_inches='tight')
    img_buffer.seek(0)
    plt.close()

    return img_buffer

# ========================
# HEALTH RISKS FUNCTION
# ========================
def get_health_risks(pollution_data):
    """Describe health risks caused by pollution levels"""
    health_issues = []

    if pollution_data['components']['pm2_5'] > 35:
        health_issues.append("Fine particulate matter (PM2.5) deeply penetrates the lungs and bloodstream, increasing risks of heart disease, strokes, and respiratory conditions.")
    if pollution_data['components']['pm10'] > 50:
        health_issues.append("PM10 exposure leads to coughing, throat irritation, and worsens conditions like asthma and bronchitis.")
    if pollution_data['components']['co'] > 5:
        health_issues.append("Carbon monoxide (CO) reduces oxygen in the body, causing dizziness, confusion, and serious risks for heart patients.")
    if pollution_data['components']['no2'] > 40:
        health_issues.append("Nitrogen dioxide (NO2) inflames the lungs, increasing asthma and lung disease risks.")
    if pollution_data['components']['o3'] > 100:
        health_issues.append("Ozone (O3) irritates the airways, causing breathing difficulties and lung damage over time.")
    if pollution_data['components']['so2'] > 20:
        health_issues.append("Sulfur dioxide (SO2) leads to coughing, wheezing, and worsens asthma symptoms.")
    if pollution_data['components']['nh3'] > 10:
        health_issues.append("Ammonia (NH3) causes eye, skin, and lung irritation, leading to long-term respiratory damage.")

    if not health_issues:
        return "Pollution levels are within safe limits. No major health concerns detected."
    
    return " ".join(health_issues)

# ========================
# FLASK ROUTE: GET POLLUTION DATA
# ========================
@app.route('/pollution', methods=['GET'])
def pollution():
    """API to get pollution description and pie chart URL"""
    city = request.args.get('city', '').strip()

    lat, lon, detected_city = get_coordinates(city if city else None)
    if lat is None or lon is None:
        return jsonify({"error": "Invalid city name or location detection failed"}), 400

    city = detected_city if not city else city
    data = get_pollution(lat, lon)
    if not data:
        return jsonify({"error": "Failed to fetch pollution data"}), 500

    pollution_data = data['list'][0]
    pie_chart = generate_pie_chart(pollution_data, city)

    try:
        upload_response = cloudinary.uploader.upload(pie_chart, folder="pollution_charts")
        image_url = upload_response['secure_url']
    except Exception as e:
        return jsonify({"error": "Failed to upload chart to Cloudinary"}), 500

    health_risks = get_health_risks(pollution_data)

    return jsonify({
        "chart_url": image_url,
        "health_risks": health_risks
    })

# ========================
# RUN THE FLASK SERVER
# ========================
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
