from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.db import models, session 


models.Base.metadata.create_all(bind=session.engine)
app = FastAPI(title="Even_Steven")

origins = [
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # allowing all methods (get, post, etc.)
    allow_headers=["*"], # allowing all headers
)

app.include_router(api_router, prefix="/api/v1")