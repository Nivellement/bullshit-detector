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
        Tu es un auditeur en efficacité organisationnelle.

        Analyse ce transcript :
        {transcript}

        Retourne UNIQUEMENT du JSON :
        {{
            "bullshit_score": 0,
            "critical_flaw": "",
            "is_actionable": true,
            "owner_detected": ""
        }}
        """

        response = self.model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)