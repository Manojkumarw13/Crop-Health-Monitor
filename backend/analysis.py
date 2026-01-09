import torch
import torchvision.models as models
import torchvision.transforms as transforms
import cv2
import numpy as np
from .utils import setup_logger

logger = setup_logger()

class AnalysisEngine:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Loading ResNet50 on {self.device}...")
        
        # Load Pretrained ResNet50 (ImageNet weights)
        self.model = models.resnet50(pretrained=True)
        self.model.eval()
        self.model.to(self.device)
        
        # Standard ImageNet transform
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

    def analyze(self, img_analysis, img_ml, features, mask):
        """
        Orchestrates the analysis pipeline for RGB images.
        """
        results = {}
        
        # 1. AI Classification (Pest/Disease) Placeholder
        img_tensor = self.transform(img_ml).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(img_tensor)
            # In a real app, we would interpret the output class here.
            # For now, we assume low risk unless heuristics say otherwise.
            
        # 2. Heuristic Analysis (Crop Health)
        health_status, health_conf = self.assess_crop_health(features)
        
        # 3. Integrate
        # Predict Pest Risk based on heuristics + health
        pest_risk, pest_conf = self.predict_pest_risk(features, health_status)
        
        results = {
            "crop_health": health_status,
            "pest_risk": pest_risk,
            "confidence_scores": {
                "crop_health": health_conf,
                "pest_risk": pest_conf
            }
        }
        
        return results

    def assess_crop_health(self, features):
        """
        Rule-based assessment based on extracted RGB features.
        """
        vari = features.get("vari_mean", 0)
        veg_cover = features.get("vegetation_cover_pct", 0)
        
        status = "Unknown"
        confidence = 0.5
        
        # Logic: High VARI + High Cover = Healthy
        if veg_cover > 20:
            if vari > 0.1:
                status = "Good"
                confidence = 0.8 + (vari * 0.5) 
            elif vari > -0.1:
                status = "Average"
                confidence = 0.7
            else:
                status = "Poor/Stressed"
                confidence = 0.8
        else:
             status = "Low Vegetation Detected"
             confidence = 0.9
             
        return status, min(confidence, 1.0)



    def predict_pest_risk(self, features, crop_health):
        """
        Pest Risk Prediction.
        """
        entropy = features.get('green_texture_entropy', 0)
        
        risk = "Low"
        confidence = 0.6
        
        if crop_health == "Poor/Stressed":
            if entropy > 5.0: # High chaos
                risk = "High"
                confidence = 0.8
            else:
                risk = "Medium"
                confidence = 0.6
        elif crop_health == "Average":
            if entropy > 6.0:
                risk = "High"
                confidence = 0.7
            elif entropy > 4.5:
                risk = "Medium"
        else:
            risk = "Low"
            confidence = 0.8
            
        return risk, confidence
