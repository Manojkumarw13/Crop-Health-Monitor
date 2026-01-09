import requests
try:
    url = "http://localhost:8000/scan"
    with open('test_leaf.png', 'rb') as f:
        files = {'file': f}
        r = requests.post(url, files=files)
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")
except Exception as e:
    print(f"Error: {e}")
