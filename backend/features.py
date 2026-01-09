import numpy as np
import cv2
from .utils import setup_logger

logger = setup_logger()

def calculate_vari(img_rgb):
    """
    Visible Atmospherically Resistant Index (VARI)
    VARI = (Green - Red) / (Green + Red - Blue)
    """
    R = img_rgb[:, :, 0].astype(np.float32)
    G = img_rgb[:, :, 1].astype(np.float32)
    B = img_rgb[:, :, 2].astype(np.float32)
    
    numerator = G - R
    denominator = G + R - B + 1e-6
    
    vari_map = numerator / denominator
    return np.mean(vari_map), vari_map

def calculate_exg(img_rgb):
    """
    Excess Green Index (ExG)
    ExG = 2*G - R - B
    """
    R = img_rgb[:, :, 0].astype(np.float32)
    G = img_rgb[:, :, 1].astype(np.float32)
    B = img_rgb[:, :, 2].astype(np.float32)
    
    exg_map = 2*G - R - B
    return np.mean(exg_map), exg_map

def get_texture_features(channel, mask):
    """
    Simple texture features: Variance and Entropy
    """
    pixels = channel[mask > 0]
    if len(pixels) == 0:
        return 0.0, 0.0
        
    variance = np.var(pixels)
    
    # Entropy
    hist, _ = np.histogram(pixels, bins=256, range=(0,256), density=True)
    hist = hist[hist > 0]
    entropy = -np.sum(hist * np.log2(hist))
    
    return float(variance), float(entropy)

def extract_features(img_analysis, mask):
    """
    Main entry for feature extraction.
    """
    try:
        # VARI
        _, vari_map = calculate_vari(img_analysis)
        vari_mean = np.mean(vari_map[mask > 0]) if np.any(mask > 0) else 0.0
        
        # ExG
        _, exg_map = calculate_exg(img_analysis)
        exg_mean = np.mean(exg_map[mask > 0]) if np.any(mask > 0) else 0.0
        
        # Vegetation Cover
        total_pixels = img_analysis.shape[0] * img_analysis.shape[1]
        veg_pixels = np.count_nonzero(mask)
        veg_cover_pct = (veg_pixels / total_pixels) * 100
        
        # Texture (on Green channel)
        G = img_analysis[:, :, 1]
        variance, entropy = get_texture_features(G, mask)
        
        features = {
            "vari_mean": float(vari_mean),
            "exg_mean": float(exg_mean),
            "vegetation_cover_pct": float(veg_cover_pct),
            "green_texture_variance": float(variance),
            "green_texture_entropy": float(entropy)
        }
        
        return features
        
    except Exception as e:
        logger.error(f"Error extracting features: {e}")
        return {}
