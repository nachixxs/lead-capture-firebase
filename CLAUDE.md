# Proyecto: lead-capture-firebase

## Qué es
Sistema de captura de leads inmobiliarios. Formulario público → guarda en Firestore
→ FastAPI manda email de confirmación → panel admin con Firebase Auth.
Demuestra los excluyentes de la oferta: Firebase Auth + Firestore.

## Stack
- React + Vite (frontend)
- Firebase Auth email/password (login del panel admin)
- Firestore (almacena leads)
- FastAPI + firebase-admin SDK (backend, email, lectura de leads)

## Config Firebase — proyecto ya creado
```
VITE_FIREBASE_API_KEY=AIzaSyCye4iTNamAQnzJcxyAJEPoqnFDEwJvLwk
VITE_FIREBASE_AUTH_DOMAIN=lead-capture-demo-db1cf.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lead-capture-demo-db1cf
VITE_FIREBASE_STORAGE_BUCKET=lead-capture-demo-db1cf.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=164308071482
VITE_FIREBASE_APP_ID=1:164308071482:web:62d56af24e53850634b103
```

## Comandos
```
# Frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install firebase && npm run dev   # localhost:5173

# Backend
python -m venv venv && venv\Scripts\activate
pip install fastapi uvicorn firebase-admin python-dotenv
uvicorn main:app --reload   # localhost:8000
```

## Estructura
```
lead-capture-firebase/
├── frontend/src/
│   ├── LeadForm.jsx       # formulario público (nombre, email, tel, mensaje)
│   ├── AdminPanel.jsx     # tabla de leads, requiere login
│   └── firebase.js        # initializeApp con config
└── backend/
    ├── main.py            # POST /leads, GET /leads
    ├── serviceAccountKey.json   # NO commitear — en .gitignore
    └── .env
```

## Debilidades a evitar — instrucciones para Claude Code
- El formulario NO es solo nombre+email. Campos: nombre, email, teléfono, mensaje, presupuesto.
- El panel admin DEBE mostrar los leads en tabla con onSnapshot (tiempo real), no getDocs.
- ANTES de cualquier código: verificar que firebase.js inicializa correctamente con las vars de entorno.
- Cerrar las security rules de Firestore antes de hacer el repo público.
- serviceAccountKey.json SIEMPRE en .gitignore — nunca commitear.

## Endpoints FastAPI
- `POST /leads` — recibe form, escribe en Firestore, envía email confirmación
- `GET /leads` — devuelve todos los leads (requiere verificación de token Firebase)

## Errores comunes
Ver `../errors/firebase.md`
