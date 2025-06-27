from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services import chatbot_service
from pydantic import BaseModel
from fastapi.responses import StreamingResponse # 1. Import StreamingResponse

router = APIRouter()

class ChatQuery(BaseModel):
    query: str

@router.post("/")
def handle_chat_query(
    chat_query: ChatQuery,
    db: Session = Depends(get_db)
):
    """
    Receives a user query and returns a streamed response from the chatbot service.
    """
    
    return StreamingResponse(
        chatbot_service.get_chatbot_response_stream(db=db, query=chat_query.query),
        media_type="text/event-stream"
    )