import os
from datetime import datetime

import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

load_dotenv()

# Firebase Admin init
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LeadIn(BaseModel):
    nombre: str
    email: EmailStr
    telefono: str = ""
    mensaje: str
    presupuesto: str = ""


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/leads", status_code=201)
def create_lead(lead: LeadIn):
    doc_ref = db.collection("leads").document()
    doc_ref.set({
        **lead.model_dump(),
        "createdAt": firestore.SERVER_TIMESTAMP,
    })
    return {"id": doc_ref.id, "message": "Lead guardado correctamente"}


@app.get("/leads")
def get_leads(authorization: str = Header(None)):
    # Verificación básica de token Firebase
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")

    token = authorization.split(" ", 1)[1]
    try:
        from firebase_admin import auth
        auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    docs = db.collection("leads").order_by(
        "createdAt", direction=firestore.Query.DESCENDING
    ).stream()

    leads = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        # Convertir Timestamp a string para serialización
        if data.get("createdAt"):
            data["createdAt"] = data["createdAt"].isoformat()
        leads.append(data)

    return leads
