from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth import router as auth_router
from api.document import router as document_router
from api.chat import router as chat_router
from api.chat_sessions import router as chat_sessions_router
from api.research_notes import router as research_notes_router
from api.dashboard import router as dashboard_router
from api.projects import router as projects_router

app = FastAPI(
    title="AI Research Assistant Pro",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(chat_router)
app.include_router(chat_sessions_router)
app.include_router(research_notes_router)
app.include_router(dashboard_router)
app.include_router(projects_router)


@app.get("/")
def home():
    return {
        "message": "AI Research Assistant Pro API is Running"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }