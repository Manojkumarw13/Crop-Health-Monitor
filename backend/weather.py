import requests

def get_weather(lat, lon, api_key=None):
    if not api_key:
        # Return mock data if no key provided
        return {
            "temperature": 25.5,
            "humidity": 60,
            "description": "Sunny (Simulated)",
            "icon": "01d"
        }
    
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": data['main']['temp'],
                "humidity": data['main']['humidity'],
                "description": data['weather'][0]['description'],
                "icon": data['weather'][0]['icon']
            }
        else:
            return {"error": "API Error"}
    except Exception as e:
        return {"error": str(e)}
