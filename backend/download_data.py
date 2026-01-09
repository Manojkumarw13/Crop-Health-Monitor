import pandas as pd
import os
import logging

# Setup basic logging if not already configured
logger = logging.getLogger(__name__)

URL = "https://raw.githubusercontent.com/Gladiator07/Harvestify/master/Data-processed/crop_recommendation.csv"
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "Crop_recommendation.csv")

def ensure_data_exists():
    """
    Checks if the crop recommendation dataset exists.
    If not, downloads it from the source.
    """
    if os.path.exists(OUTPUT_PATH):
        logger.info(f"Data already exists at {OUTPUT_PATH}")
        return

    try:
        logger.info(f"Downloading data from {URL}...")
        df = pd.read_csv(URL)
        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        df.to_csv(OUTPUT_PATH, index=False)
        logger.info(f"Download successful! Saved to {OUTPUT_PATH}")
    except Exception as e:
        logger.error(f"Error downloading data: {e}")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    ensure_data_exists()
