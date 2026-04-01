from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import todos
from .database import engine, Base

# Note: Database migrations are handled by Alembic, not by create_all()
# Base.metadata.create_all(bind=engine)  # Commented out in favor of Alembic migrations

app = FastAPI(title="ToDo API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(todos.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to ToDo API", "docs": "/docs"}
