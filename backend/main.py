from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, get_db, Base
from .models import ScanHistory
from .ml_utils import load_models, predict_crop, analyze_image, calculate_ndvi, chat_with_agronomist
from pydantic import BaseModel
from PIL import Image
import io
import shutil
from fastapi.staticfiles import StaticFiles
from .weather import get_weather
from dotenv import load_dotenv

load_dotenv()

# Initialize DB
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Crop Monitor")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory to serve images
app.mount("/static", StaticFiles(directory="."), name="static")

@app.on_event("startup")
def startup_event():
    load_models()

@app.get("/")
def read_root():
    return {"status": "AI System Operational"}

@app.get("/weather")
def read_weather(lat: float, lon: float):
    return get_weather(lat, lon)

@app.post("/recommend")
def recommend(n: float, p: float, k: float, temp: float, hum: float, ph: float, rain: float):
    prediction = predict_crop(n, p, k, temp, hum, ph, rain)
    return {"recommended_crop": prediction}

@app.post("/scan")
async def scan_plant(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Read Image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # 1. Disease Detection
    ml_result = analyze_image(image)
    top_disease = ml_result[0]['label']
    confidence = ml_result[0]['score']

    # 2. Save to DB (Postgres)
    scan = ScanHistory(
        disease_detected=top_disease,
        confidence=confidence
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "disease": top_disease,
        "confidence": confidence,
        "scan_id": scan.id
    }

@app.post("/scan/ndvi")
async def scan_ndvi(file: UploadFile = File(...)):
    # Save temp file for OpenCV
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    ndvi_path = calculate_ndvi(temp_path)
    
    return {"ndvi_image": f"/static/{ndvi_path}"} # Return URL path

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    response = chat_with_agronomist(request.message)
    return {"response": response}
