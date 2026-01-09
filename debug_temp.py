import tempfile
import cv2
import os
import numpy as np

try:
    print("Creating temp file...")
    # Create a dummy white image
    dummy_img = np.full((100, 100, 3), 255, dtype=np.uint8)
    
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        # Save via cv2 to bytes or just write noise? 
        # Better to save valid image bytes so imread doesn't fail on format
        is_success, buffer = cv2.imencode(".jpg", dummy_img)
        tmp.write(buffer)
        tmp.flush() # Ensure written
        
        print(f"File created: {tmp.name}")
        
        # Try to read with cv2 while open
        print("Attempting cv2.imread inside with block...")
        try:
            img = cv2.imread(tmp.name)
            if img is None:
                print("Read result: None (Failed to read)")
            else:
                print(f"Read result: Shape {img.shape}")
        except Exception as e_inner:
             print(f"Inner Exception: {e_inner}")

    print("Exited with block. Closing confirmed.")
    # Try reading again
    print("Attempting cv2.imread OUTSIDE with block...")
    img = cv2.imread(tmp.name)
    print(f"Read result: {img.shape if img is not None else 'None'}")
    
    os.remove(tmp.name)
        
except Exception as e:
    print(f"Outer Exception: {e}")
