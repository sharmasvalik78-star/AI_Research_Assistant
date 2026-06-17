from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import Base, engine

from models.user import User

from api.dashboard import router as dashboard_router
from api.auth import router as auth_router
from api.upload import router as upload_router
from api.chat import router as chat_router
from api.code import router as code_router
from api.viva import router as viva_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Research Assistant"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(upload_router, prefix="/upload")
app.include_router(chat_router, prefix="/chat")
app.include_router(code_router, prefix="/code")
app.include_router(viva_router, prefix="/viva")

app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "API Running"
    }
