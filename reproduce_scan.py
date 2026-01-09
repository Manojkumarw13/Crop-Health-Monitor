import requests
import os

url_scan = "http://localhost:8000/scan"
url_ndvi = "http://localhost:8000/scan/ndvi"
file_path = "test_leaf.png"

if not os.path.exists(file_path):
    print(f"File {file_path} not found!")
    exit(1)

print(f"Testing Scan Endpoint with {file_path}...")
try:
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url_scan, files=files)
        
    print(f"Scan Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Scan Response JSON (First 500 chars):")
        print(str(response.json())[:500])
    else:
        print("Scan Error Response:")
        print(response.text)
except Exception as e:
    print(f"Scan Exception: {e}")

print("\nTesting NDVI Endpoint...")
try:
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url_ndvi, files=files)
        
    print(f"NDVI Status Code: {response.status_code}")
    if response.status_code == 200:
        print("NDVI Response JSON:")
        print(response.json())
    else:
        print("NDVI Error Response:")
        print(response.text)
except Exception as e:
    print(f"NDVI Exception: {e}")
