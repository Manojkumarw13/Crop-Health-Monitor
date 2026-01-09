from fastapi import FastAPI, Depends, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import engine, get_db, Base
from .models import ScanHistory, SoilLog
from .ml_utils import load_models, analyze_image, calculate_ndvi, chat_with_agronomist, predict_pest, assess_soil_health
from pydantic import BaseModel
from PIL import Image
import io
import shutil
import os
from fastapi.staticfiles import StaticFiles
from .weather import get_weather
from dotenv import load_dotenv


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

from .download_data import ensure_data_exists

@app.on_event("startup")
def startup_event():
    ensure_data_exists()
    load_models()

@app.get("/")
def read_root():
    return {"status": "AI System Operational"}

@app.get("/weather")
def read_weather(lat: float, lon: float):
    return get_weather(lat, lon)

@app.post("/recommend")
@app.post("/recommend")
def recommend_soil_health(n: float, p: float, k: float, temp: float, hum: float, ph: float, rain: float):
    # Soil Health Analysis
    result = assess_soil_health(n, p, k, temp, hum, ph, rain)
    return result

@app.post("/scan")
async def scan_plant(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Read Image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # 1. Disease Detection & Full Analysis
    ml_result = analyze_image(image)
    
    # Extract backward-compatible fields
    top_disease = ml_result.get('top_disease', 'Unknown')
    confidence = ml_result.get('disease_confidence', 0.0)

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
        "scan_id": scan.id,
        "analysis": ml_result # Return full rich analysis
    }

@app.get("/history")
def get_scan_history(db: Session = Depends(get_db)):
    history = db.query(ScanHistory).order_by(ScanHistory.timestamp.desc()).limit(50).all()
    return history

def remove_file(path: str):
    try:
        os.remove(path)
    except Exception:
        pass

@app.post("/scan/ndvi")
async def scan_ndvi(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    # Save temp file for OpenCV
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    ndvi_path = calculate_ndvi(temp_path)
    
    # Clean up temp file after response
    background_tasks.add_task(remove_file, temp_path)
    
    return {"ndvi_image": f"/static/{ndvi_path}"} # Return URL path

class SoilLogCreate(BaseModel):
    n: float
    p: float
    k: float
    ph: float

@app.post("/soil-logs")
def create_soil_log(log: SoilLogCreate, db: Session = Depends(get_db)):
    new_log = SoilLog(
        nitrogen=log.n,
        phosphorus=log.p,
        potassium=log.k,
        ph=log.ph
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/soil-logs")
def get_soil_logs(db: Session = Depends(get_db)):
    return db.query(SoilLog).order_by(SoilLog.timestamp.desc()).limit(20).all()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat(request: ChatRequest):
    response = chat_with_agronomist(request.message)
    return {"response": response}

class PestRequest(BaseModel):
    temperature: float
    humidity: float

@app.post("/predict/pest")
def pest_predict(request: PestRequest):
    risk = predict_pest(request.temperature, request.humidity)
    return {"risk": risk}
