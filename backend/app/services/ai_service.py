import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

        self.model = genai.GenerativeModel(
            "models/gemini-2.5-flash"
        )

    async def analyze_meeting(self, transcript: str):

        prompt = f"""
        Tu es un auditeur critique spécialisé dans la détection de dysfonctionnements organisationnels.
        Analyse le transcript suivant : "{transcript}"

        Objectifs :
        1. Identifier les décisions SANS engagement ferme (ex: "on verra", "peut-être").
        2. Repérer les tâches citées sans qu'une personne précise ne soit nommée responsable.
        3. Détecter si deux affirmations se contredisent.

        Réponds EXCLUSIVEMENT en JSON avec cette structure :
        {{
            "bullshit_score": (int 0-100),
            "critical_issues": [
                {{
                    "type": "AMBIGUITY | UNOWNED_ACTION | CONTRADICTION",
                    "description": "Explication courte",
                    "severity": "LOW | MEDIUM | HIGH"
                }}
            ],
            "risk_level": "LOW | MEDIUM | HIGH"
        }}
        """

        response = self.model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)