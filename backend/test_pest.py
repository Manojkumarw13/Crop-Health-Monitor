from ml_utils import predict_pest
import sys
import os

def test_pest_prediction():
    print("Testing Pest Prediction Logic...")
    
    # Test Case 1: High Risk Aphids
    res = predict_pest(32, 75)
    print(f"Temp=32, Hum=75 -> {res}")
    assert "Aphids" in res
    
    # Test Case 2: High Risk Mites
    res = predict_pest(32, 30)
    print(f"Temp=32, Hum=30 -> {res}")
    assert "Mites" in res
    
    # Test Case 3: Low Risk
    res = predict_pest(25, 50)
    print(f"Temp=25, Hum=50 -> {res}")
    assert "Low Risk" in res
    
    print("Pest Prediction Verification Passed!")

if __name__ == "__main__":
    test_pest_prediction()
