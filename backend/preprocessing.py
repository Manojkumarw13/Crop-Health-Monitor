import cv2
import numpy as np
import os
from .utils import setup_logger

logger = setup_logger()


def preprocess_image(image_path, target_size=(224, 224)):
    """
    Loads and preprocesses an RGB image:
    1. Loads High-Res RGB
    2. Resizes to target_size for ML use
    3. Retains original or slightly larger size for Analysis
    4. Applies denoising and illumination correction
    """
    try:
        # Load image
        img = cv2.imread(image_path)
        if img is None:
            logger.error(f"Failed to load image: {image_path}")
            return None, None
        
        # Convert BGR to RGB
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Denoise (Gaussian Blur)
        img_denoised = cv2.GaussianBlur(img_rgb, (3, 3), 0)
        
        # Illumination Correction (CLAHE on L channel of LAB)
        lab = cv2.cvtColor(img_denoised, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl, a, b))
        img_corrected = cv2.cvtColor(limg, cv2.COLOR_LAB2RGB)
        
        # Resize for ML (Standard 224x224)
        img_ml = cv2.resize(img_corrected, target_size)
        
        # Original (or reasonable analysis size)
        # If image is massive, downscale for performance, otherwise keep
        h, w = img_corrected.shape[:2]
        if max(h, w) > 1024:
            scale = 1024 / max(h, w)
            img_analysis = cv2.resize(img_corrected, (int(w*scale), int(h*scale)))
        else:
            img_analysis = img_corrected
            
        return img_analysis, img_ml
        
    except Exception as e:
             
        # Create ML stack (resize to target)
        # Sort bands for consistent stacking: B, G, R, RE, NIR
        ordered_bands = []
        for b in ['blue', 'green', 'red', 'red_edge', 'nir']:
            if b in data_dict:
                # Resize band
                resized_band = cv2.resize(data_dict[b], target_size)
                ordered_bands.append(resized_band)
        
        if ordered_bands:
            img_ml = np.stack(ordered_bands, axis=-1)
        else:
            img_ml = None
            
        return data_dict, img_ml

    except Exception as e:
        logger.error(f"Error in preprocessing multispectral: {e}")
        return None, None

def preprocess_hyperspectral(input_path, target_size=None):
    """
    Loads hyperspectral data.
    Input: Path to .npy or .mat file.
    Output: Spectral Cube (H, W, Bands)
    """
    try:
        cube = None
        if input_path.endswith('.npy'):
            cube = np.load(input_path)
        
        # Simple noise reduction (spectral smoothing could be added here)
        if cube is not None:
            # Check dimensions
            return cube, cube # Return same for analysis and ML for now (ML might need 1D vectors)
            
        return None, None
    except Exception as e:
        logger.error(f"Error in preprocessing hyperspectral: {e}")
        return None, None


def create_vegetation_mask(img_rgb):
    """
    Creates a binary mask for vegetation using HSV thresholds.
    Returns: mask (0/255), masked_img
    """
    hsv = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2HSV)
    
    # Healthy Vegetation Range (Approximate)
    # Hue: Green is around 60. Range 30-90 usually covers green plants.
    lower_green = np.array([30, 40, 40])
    upper_green = np.array([90, 255, 255])
    
    mask = cv2.inRange(hsv, lower_green, upper_green)
    
    # Clean up mask with morphology
    kernel = np.ones((3,3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    masked_img = cv2.bitwise_and(img_rgb, img_rgb, mask=mask)
    
    return mask, masked_img
