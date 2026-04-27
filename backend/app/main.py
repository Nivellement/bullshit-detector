from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .database import engine, get_db
from . import models
from .services.ai_service import AIService
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Anti-Bullshit Detector")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
ai_service = AIService()

models.Base.metadata.create_all(bind=engine)

class MeetingInput(BaseModel):
    transcript: str


@app.get("/")
async def root():
    return {"message": "Anti-Bullshit API is running"}

@app.post("/upload")
async def upload_meeting(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Analyse un fichier transcript .txt"""
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Seuls les fichiers .txt sont acceptés.")
        
    content = await file.read()
    transcript_text = content.decode("utf-8")

    result = await ai_service.analyze_meeting(transcript_text)

    new_analysis = models.Analysis(
        transcript=transcript_text,
        bullshit_score=result["bullshit_score"],
        risk_level=result["risk_level"],
        raw_analysis=result
    )

    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return {"id": new_analysis.id, "filename": file.filename, "analysis": result}

@app.post("/analyze")
async def analyze(data: MeetingInput, db: Session = Depends(get_db)):
    """Analyse un texte brut envoyé en JSON"""
    result = await ai_service.analyze_meeting(data.transcript)

    new_analysis = models.Analysis(
        transcript=data.transcript,
        bullshit_score=result["bullshit_score"],
        risk_level=result["risk_level"],
        raw_analysis=result
    )

    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)

    return {"id": new_analysis.id, "analysis": result}

@app.get("/analyses")
async def get_all_analyses(db: Session = Depends(get_db)):
    """Récupère l'historique des analyses"""
    return db.query(models.Analysis).order_by(models.Analysis.created_at.desc()).all()

@app.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    return analysis