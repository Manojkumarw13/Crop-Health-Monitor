import sys
import os
import cv2
import numpy as np

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.ml_utils import predict_pest, predict_crop, load_models, calculate_ndvi, analyze_image
from backend.database import engine, Base
from backend import models
from sqlalchemy import inspect

def create_dummy_image(filename="test_leaf.jpg"):
    # Create a green image (simulating healthy leaf)
    img = np.zeros((100, 100, 3), dtype=np.uint8)
    img[:, :, 1] = 200  # High Green
    img[:, :, 2] = 50   # Low Red
    img[:, :, 0] = 50   # Low Blue
    cv2.imwrite(filename, img)
    return filename

def test_features():
    print("=== STARTING BACKEND VERIFICATION ===")
    
    # 1. Load Models
    print("\n[1] Loading Models...")
    load_models()
    
    # 2. Test Crop Recommendation
    print("\n[2] Testing Crop Recommendation...")
    # N=90, P=42, K=43, Temp=20.8, Hum=82, pH=6.5, Rain=202 (Rice conditions)
    crop = predict_crop(90, 42, 43, 20.8, 82.0, 6.5, 202.9)
    print(f"Input: Rice-like conditions. Prediction: {crop}")
    if crop != "Model not loaded":
        print("PASS: Crop Model working.")
    else:
        print("FAIL: Crop Model not loaded.")

    # 3. Test Pest Prediction
    print("\n[3] Testing Pest Prediction...")
    pest = predict_pest(35, 80)
    print(f"Input: Temp=35, Hum=80. Prediction: {pest}")
    if "Risk" in pest:
        print("PASS: Pest Logic working.")
    else:
        print("FAIL: Pest Logic result unexpected.")

    # 4. Test NDVI/VARI
    print("\n[4] Testing NDVI/VARI...")
    img_path = create_dummy_image("backend/test_leaf.jpg")
    try:
        output_path = calculate_ndvi(img_path)
        if output_path and os.path.exists(output_path):
            print(f"PASS: NDVI generated at {output_path}")
            # cleanup
            os.remove(output_path)
        else:
            print("FAIL: NDVI generation failed.")
    except Exception as e:
        print(f"FAIL: NDVI Error: {e}")
    finally:
        if os.path.exists(img_path): os.remove(img_path)

    # 5. Test Database Tables
    print("\n[5] Testing Database Schema...")
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    required_tables = ['scan_history', 'soil_logs', 'users']
    missing = [t for t in required_tables if t not in tables]
    
    if not missing:
        print(f"PASS: All tables found: {tables}")
    else:
        print(f"FAIL: Missing tables: {missing}")
        
    print("\n=== VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    test_features()
