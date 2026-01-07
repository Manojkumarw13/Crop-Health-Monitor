from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    image_path = Column(String, nullable=True)
    disease_detected = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    crop_recommendation = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

class SoilLog(Base):
    __tablename__ = "soil_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    ph = Column(Float)
