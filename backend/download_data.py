import pandas as pd
import os

url = "https://raw.githubusercontent.com/Gladiator07/Harvestify/master/Data-processed/crop_recommendation.csv"
output_path = "../data/Crop_recommendation.csv"

try:
    print(f"Downloading from {url}...")
    df = pd.read_csv(url)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print("Download successful!")
except Exception as e:
    print(f"Error downloading: {e}")
