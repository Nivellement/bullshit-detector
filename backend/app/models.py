from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from datetime import datetime
from .database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text) # Le texte brut envoyé par l'utilisateur
    bullshit_score = Column(Integer)
    risk_level = Column(String) # LOW, MEDIUM, HIGH
    raw_analysis = Column(JSON) # L'objet JSON complet reçu de Gemini
    created_at = Column(DateTime, default=datetime.utcnow)