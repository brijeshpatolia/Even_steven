from fastapi import APIRouter
from app.api.endpoints import groups, balances

api_router = APIRouter()

api_router.include_router(groups.router, prefix="/groups", tags=["Groups"])
api_router.include_router(balances.router, prefix="/balances", tags=["Balances"])


@api_router.get("/health")
def health_check():
    return {"status": "ok"}
