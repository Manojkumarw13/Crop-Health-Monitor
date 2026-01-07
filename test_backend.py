import requests
import time
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_backend():
    print("Waiting for server to start...")
    # Retry connection for up to 300 seconds
    for _ in range(150):
        try:
            r = requests.get(f"{BASE_URL}/")
            if r.status_code == 200:
                print("Server is UP!")
                break
        except requests.exceptions.ConnectionError:
            time.sleep(2)
            print(".", end="", flush=True)
    else:
        print("\nServer failed to start in time.")
        sys.exit(1)

    # 1. Test Root
    print("\nTesting / (Health Check)...")
    r = requests.get(f"{BASE_URL}/")
    print(r.json())
    assert r.status_code == 200

    # 2. Test Weather
    print("\nTesting /weather...")
    # Using specific coordinates
    r = requests.get(f"{BASE_URL}/weather", params={"lat": 12.97, "lon": 77.59})
    print(r.json())
    assert r.status_code == 200
    assert "temperature" in r.json()

    # 3. Test Soil Logs (DB Write)
    print("\nTesting POST /soil-logs...")
    payload = {"n": 50, "p": 40, "k": 30, "ph": 6.5}
    r = requests.post(f"{BASE_URL}/soil-logs", json=payload)
    print(r.json())
    assert r.status_code == 200

    # 4. Test Soil Logs (DB Read)
    print("\nTesting GET /soil-logs...")
    r = requests.get(f"{BASE_URL}/soil-logs")
    print(f"Retrieved {len(r.json())} logs")
    assert r.status_code == 200
    assert len(r.json()) > 0

    print("\nALL SYSTEM CHECKS PASSED ✅")

if __name__ == "__main__":
    test_backend()
