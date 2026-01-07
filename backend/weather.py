import requests

def get_weather(lat, lon, api_key=None):
    # Open-Meteo API (Free, No Key Required)
    # api_key arg is kept for backward compatibility but ignored
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            current = data['current']
            
            # WMO Weather interpretation codes (simplified)
            weather_code = current['weather_code']
            description = "Clear sky"
            if weather_code in [1, 2, 3]: description = "Partly cloudy"
            elif weather_code in [45, 48]: description = "Foggy"
            elif weather_code in [51, 53, 55, 61, 63, 65]: description = "Rain"
            elif weather_code >= 80: description = "Storms"

            return {
                "temperature": current['temperature_2m'],
                "humidity": current['relative_humidity_2m'],
                "description": description,
                "icon": "01d" # Placeholder icon as Open-Meteo doesn't provide them
            }
        else:
            return {"error": "API Error"}
    except Exception as e:
        return {"error": str(e)}
