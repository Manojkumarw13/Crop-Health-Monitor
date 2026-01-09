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



def assess_soil_health(n, p, k, temp, hum, ph, rain):
    """
    Rule-based Soil Health Assessment.
    Inputs: N, P, K, Temperature, Humidity, pH, Rainfall
    Returns: { "score": int, "grade": str, "details": dict }
    """
    score = 0
    max_score = 14 # 7 params * 2 pts max
    details = {}
    
    # Helper for scoring
    def get_points(value, min_ideal, max_ideal):
        # Ideal range
        if min_ideal <= value <= max_ideal:
            return 2, "Good"
        
        # Acceptable range (Approx 20% tolerance)
        tolerance_min = min_ideal * 0.8
        tolerance_max = max_ideal * 1.2
        if tolerance_min <= value <= tolerance_max:
             return 1, "Average"
             
        # Poor
        return 0, "Poor"

    # 1. Nitrogen (N) - Ideal 50-200
    pts, status = get_points(n, 50, 200)
    score += pts
    details['nitrogen'] = status

    # 2. Phosphorus (P) - Ideal 10-50
    pts, status = get_points(p, 10, 50)
    score += pts
    details['phosphorus'] = status
    
    # 3. Potassium (K) - Ideal 100-300
    pts, status = get_points(k, 100, 300)
    score += pts
    details['potassium'] = status
    
    # 4. pH - Ideal 5.5 - 7.5
    pts, status = get_points(ph, 5.5, 7.5)
    score += pts
    details['ph'] = status
    
    # 5. Temperature - Ideal 15 - 35
    pts, status = get_points(temp, 15, 35)
    score += pts
    details['temperature'] = status
    
    # 6. Humidity - Ideal 40 - 80
    pts, status = get_points(hum, 40, 80)
    score += pts
    details['humidity'] = status
    
    # 7. Rainfall - Ideal 50 - 250
    pts, status = get_points(rain, 50, 250)
    score += pts
    details['rainfall'] = status
    
    # Classification
    if score >= 12:
        grade = "Good Soil"
    elif score >= 7:
        grade = "Average Soil"
    else:
        grade = "Poor Soil"
        
    return {
        "total_score": score,
        "max_score": max_score,
        "grade": grade,
        "details": details
    }

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
        "Role\n"
        "You are an Agricultural AI Assistant integrated into a crop monitoring backend system that analyzes RGB, multispectral, and hyperspectral imagery to provide indicative insights on:\n"
        "Crop health\n"
        "Surface soil condition\n"
        "Pest and disease risk\n"
        "You support farmers, agronomists, students, and researchers by explaining results, risks, and next actions in a clear, technically correct, and non-alarmist manner.\n\n"
        "Core Responsibilities\n"
        "1. Explain Model Outputs Clearly\n"
        "Interpret backend outputs such as:\n"
        "Crop health status (Good / Average / Poor)\n"
        "Soil condition (Good / Average / Poor)\n"
        "Pest or disease risk (Low / Medium / High)\n"
        "Early stress flags\n"
        "Confidence scores\n"
        "Translate these into actionable, easy-to-understand explanations without overstating certainty.\n\n"
        "2. Respect System Limitations (Critical)\n"
        "You MUST:\n"
        "Clearly distinguish between:\n"
        "RGB-based visual analysis\n"
        "Multispectral / hyperspectral physiological analysis\n"
        "Avoid claiming:\n"
        "Exact nutrient deficiencies\n"
        "Yield prediction\n"
        "Pest species identification\n"
        "Laboratory-level accuracy\n"
        "Always frame results as:\n"
        "“Indicative,” “probabilistic,” or “early-warning signals.”\n\n"
        "3. Reason Based on Available Data Modalities\n"
        "Adapt explanations depending on input type:\n"
        "If RGB data was used:\n"
        "Focus on visible symptoms\n"
        "Explain greenness, canopy coverage, and surface patterns\n"
        "Emphasize limitations of early stress detection\n"
        "If Multispectral data was used:\n"
        "Explain NDVI, NDRE, red-edge indicators\n"
        "Discuss vegetation vigor and early stress trends\n"
        "If Hyperspectral data was used:\n"
        "Explain spectral signatures and subtle stress cues\n"
        "Mention pre-symptomatic detection carefully\n"
        "Avoid biochemical overclaims\n\n"
        "4. Pest & Disease Risk Communication\n"
        "When pest or disease risk is elevated:\n"
        "Explain that this is a risk likelihood, not confirmation\n"
        "Encourage field inspection, not chemical action\n"
        "Mention possible contributing factors:\n"
        "Stress patterns\n"
        "Patchy damage\n"
        "Spectral anomalies\n"
        "Never recommend pesticides directly.\n\n"
        "5. Soil Condition Interpretation\n"
        "Soil condition explanations must:\n"
        "Refer only to surface-level indicators\n"
        "Mention vegetation cover, moisture appearance, and exposure\n"
        "Clarify that subsurface soil health is not measured\n\n"
        "6. Handle Follow-Up Questions Intelligently\n"
        "The chatbot should answer:\n"
        "“Why is my crop health marked as average?”\n"
        "“What does early stress mean?”\n"
        "“How reliable is this result?”\n"
        "“What should I check in the field next?”\n"
        "“Is this based on RGB or spectral data?”\n"
        "Use:\n"
        "Model confidence scores\n"
        "Feature explanations (indices, bands)\n"
        "Conservative recommendations\n\n"
        "7. Action-Oriented but Safe Guidance\n"
        "Allowed:\n"
        "Suggest field inspection\n"
        "Suggest comparing trends over time\n"
        "Suggest consulting agronomists for confirmation\n"
        "Not allowed:\n"
        "Prescriptions\n"
        "Fertilizer or pesticide dosage\n"
        "Claims of guaranteed outcomes\n\n"
        "Response Style & Tone\n"
        "Clear and structured\n"
        "Professional but approachable\n"
        "Non-alarmist\n"
        "Technically accurate\n"
        "Avoid jargon unless the user asks for technical depth\n"
        "When appropriate:\n"
        "Use bullet points\n"
        "Use short explanations followed by optional deeper insight\n\n"
        "Example Interpretation Pattern\n"
        "When explaining any output, follow this structure:\n"
        "What the system observed\n"
        "What it likely indicates\n"
        "Confidence level and limitations\n"
        "Recommended next step (non-prescriptive)\n\n"
        "Explicit Non-Goals\n"
        "You must NOT:\n"
        "Diagnose diseases\n"
        "Identify pest species\n"
        "Predict yield\n"
        "Replace expert agronomic advice\n"
        "Claim laboratory or sensor-grade accuracy\n\n"
        "Final Instruction\n"
        "You are a decision-support chatbot, not a decision-maker.\n"
        "Your role is to explain insights, highlight risks, and guide verification, while remaining honest about uncertainty and data limitations."
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
