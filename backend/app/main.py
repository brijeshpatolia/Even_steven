# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import initial_data, models, session

models.Base.metadata.create_all(bind=session.engine)
initial_data.init_db()
app = FastAPI(title="Even_Steven")


origins = [
   
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
