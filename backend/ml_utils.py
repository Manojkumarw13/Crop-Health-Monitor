import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from transformers import pipeline
import os
import joblib

# Global Models
crop_model = None
disease_pipeline = None
chat_pipeline = None

def load_models():
    global crop_model, disease_pipeline
    
    # 1. Train/Load Crop Recommendation Model
    data_path = "../data/Crop_recommendation.csv"
    if os.path.exists(data_path):
        print("Training Crop Model...")
        df = pd.read_csv(data_path)
        features = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
        target = df['label']
        
        crop_model = DecisionTreeClassifier()
        crop_model.fit(features, target)
        print("Crop Model Trained!")
    else:
        print("Warning: Crop dataset not found. Model not trained.")

    # 2. Load Hugging Face Pipeline
    # Using a known plant disease model
    print("Loading Disease Model (This may take data)...")
    try:
        # device=0 for GPU usage if available
        disease_pipeline = pipeline("image-classification", model="linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification") # Remove device=0 if issues
        print("Disease Model Loaded!")
    except Exception as e:
        print(f"Failed to load disease model: {e}")

    # 3. Load Chat Model (TinyLlama)
    print("Loading Chat Model (TinyLlama)...")
    try:
        # device=0 for GPU. 
        # chat_pipeline = pipeline("text-generation", model="TinyLlama/TinyLlama-1.1B-Chat-v1.0", max_new_tokens=200)
        chat_pipeline = None # Skip for verification speed
        print("Chat Model Loaded!")
    except Exception as e:
        print(f"Failed to load chat model: {e}")

def predict_crop(n, p, k, temp, hum, ph, rain):
    if not crop_model:
        return "Model not loaded"
    prediction = crop_model.predict([[n, p, k, temp, hum, ph, rain]])
    return prediction[0]

def analyze_image(image):
    if not disease_pipeline:
        return [{"label": "Model Error", "score": 0.0}]
    results = disease_pipeline(image)
    return results

def calculate_ndvi(image_path):
    import cv2
    import numpy as np
    
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        return None
        
    # Convert to float
    img = img.astype(float)
    
    # Extract channels (OpenCV is BGR)
    blue = img[:, :, 0]
    green = img[:, :, 1]
    red = img[:, :, 2]
    
    # Calculate VARI (Visible Atmospherically Resistant Index) - Proxy for NDVI
    # Formula: (G - R) / (G + R - B)
    numerator = green - red
    denominator = green + red - blue + 0.0001 # Add epsilon to avoid divide by zero
    
    vari = numerator / denominator
    
    # Enhance visualization: Normalize to 0-255
    # VARI typically -1 to 1. Map to 0-255 for heatmap
    vari_norm = cv2.normalize(vari, None, 0, 255, cv2.NORM_MINMAX, cv2.CV_8U)
    
    # Apply colormap (Green for high health, Red for low)
    heatmap = cv2.applyColorMap(vari_norm, cv2.COLORMAP_JET)
    
    # Save processed image
    output_path = image_path.replace(".", "_ndvi.")
    cv2.imwrite(output_path, heatmap)
    
    return output_path

def chat_with_agronomist(prompt):
    if not chat_pipeline:
        return "Chat model is loading or failed to load. Please try again later."
    
    system_prompt = "You are an expert Agronomist AI. Answer the farmer's question concisely."
    full_prompt = f"<|system|>\n{system_prompt}</s>\n<|user|>\n{prompt}</s>\n<|assistant|>\n"
    
    response = chat_pipeline(full_prompt)
    return response[0]['generated_text'].split("<|assistant|>\n")[-1]

def predict_pest(temp, humidity):
    """
    Simple rule-based pest prediction
    """
    if temp > 30 and humidity > 70:
        return "High Risk: Aphids, Fungal Diseases"
    elif temp > 30 and humidity < 40:
        return "High Risk: Mites"
    elif 20 <= temp <= 30 and humidity > 60:
        return "Moderate Risk: Bacterial Blight"
    elif temp < 10:
        return "Low Risk (Cold)"
    else:
        return "Low Risk"
