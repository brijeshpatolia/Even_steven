from fastapi import FastAPI

from app.api.router import api_router
from app.db import models, session 


models.Base.metadata.create_all(bind=session.engine)


app = FastAPI(title="Even_Steven")

app.include_router(api_router, prefix="/api/v1")