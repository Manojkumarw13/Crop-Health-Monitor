import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from transformers import pipeline
import os
import cv2
import numpy as np
import tempfile
from PIL import Image

# Import new Engine modules
try:
    from .analysis import AnalysisEngine
    from .preprocessing import preprocess_image, create_vegetation_mask
    from .features import extract_features
except ImportError:
    # Fallback/Dev mode if imports fail (e.g. running script directly)
    pass

# Global Models
crop_model = None
disease_pipeline = None
analysis_engine = None

def load_models():
    global crop_model, disease_pipeline, analysis_engine
    
    # 1. Train/Load Crop Recommendation Model
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "..", "data", "Crop_recommendation.csv")
    
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

    # 2. Load Hugging Face Pipeline (Disease)
    print("Loading Disease Model...")
    try:
        disease_pipeline = pipeline("image-classification", model="linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
        print("Disease Model Loaded!")
    except Exception as e:
        print(f"Failed to load disease model: {e}")

    # 3. Load Analysis Engine
    print("Loading Analysis Engine (ResNet + Heuristics)...")
    try:
        analysis_engine = AnalysisEngine()
        print("Analysis Engine Loaded!")
    except Exception as e:
        print(f"Failed to load Analysis Engine: {e}")

    print("AI Components Initialized")

def predict_crop(n, p, k, temp, hum, ph, rain):
    if not crop_model:
        return "Model not loaded"
    prediction = crop_model.predict([[n, p, k, temp, hum, ph, rain]])
    return prediction[0]

def analyze_image(image: Image.Image):
    """
    Comprehensive Image Analysis:
    1. Disease Detection (HF Model)
    2. Crop Health (Heuristics)
    3. Soil Condition (CV)
    4. Pest Risk (Hybrid)
    """
    results = {}
    
    # 1. Disease Detection (Existing)
    if disease_pipeline:
        try:
            hf_results = disease_pipeline(image)
            results['disease_prediction'] = hf_results
            results['top_disease'] = hf_results[0]['label']
            results['disease_confidence'] = hf_results[0]['score']
        except Exception as e:
            results['disease_error'] = str(e)
            results['top_disease'] = "Error"
            results['disease_confidence'] = 0.0
    
    # 2. Advanced Analysis (New Engine)
    if analysis_engine:
        try:
            # Save to temp file for CV2 processing (Engine expects path)
            # Fix for Windows: Use mkstemp or close NamedTemporaryFile before reopening
            fd, temp_path = tempfile.mkstemp(suffix=".jpg")
            os.close(fd) # Close the file descriptor so it can be opened by other processes/libs
            
            try:
                image.save(temp_path)
            
                # Pipeline
                img_analysis, img_ml = preprocess_image(temp_path)
                
                if img_analysis is not None:
                    mask, _ = create_vegetation_mask(img_analysis)
                    features = extract_features(img_analysis, mask)
                    engine_results = analysis_engine.analyze(img_analysis, img_ml, features, mask)
                    
                    results.update(engine_results) # Merge dictionaries
                    results['features'] = features
            finally:
                # Cleanup
                if os.path.exists(temp_path):
                    try:
                        os.remove(temp_path)
                    except:
                        pass
                
        except Exception as e:
            print(f"Engine Analysis Failed: {e}")
            results['engine_error'] = str(e)
    
    # Ensure baseline keys exist if engine failed
    if 'crop_health' not in results:
        results['crop_health'] = "Unknown"
        results['soil_condition'] = "Unknown"
        results['pest_risk'] = "Low"

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
    import requests
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "Error: OPENROUTER_API_KEY not found in environment variables."

    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    system_prompt = (
        "You are an expert Agronomist AI named 'AgriBot'. "
        "You verify crop health, suggest farming techniques, and diagnose pest/disease issues. "
        "Your answers should be concise, practical, and easy for a farmer to understand. "
        "If asked about something non-agricultural, politely redirect to farming topics."
    )
    
    data = {
        "model": "mistralai/mistral-7b-instruct:free",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content']
        else:
            return f"Error from AI Provider: {response.text}"
    except Exception as e:
        return f"Connection Error: {str(e)}"

def predict_pest(temp, humidity):
    """
    Simple rule-based pest prediction (Fallback if engine fails or for quick check)
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
