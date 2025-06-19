import openai
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings
from app.db import models
from collections.abc import Generator

# Configure the OpenAI client
client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)

def get_context_for_llm(db: Session) -> str:
    # This function remains the same as before
    context_parts = []
    users = db.query(models.User).all()
    if users:
        user_list = ", ".join([f"{user.name} (ID: {user.id})" for user in users])
        context_parts.append(f"Users in the system: {user_list}")
    groups = db.query(models.Group).options(
        joinedload(models.Group.members),
        joinedload(models.Group.expenses).joinedload(models.Expense.paid_by)
    ).all()
    context_parts.append("\n--- DATA ---")
    for group in groups:
        context_parts.append(f"\nGroup: '{group.name}' (ID: {group.id})")
        member_list = ", ".join([member.name for member in group.members])
        context_parts.append(f"  - Members: {member_list}")
        if not group.expenses:
            context_parts.append("  - No expenses yet.")
        else:
            context_parts.append("  - Expenses:")
            for expense in group.expenses:
                context_parts.append(
                    f"    - '{expense.description}' for ${expense.amount:.2f}, paid by {expense.paid_by.name}."
                )
    return "\n".join(context_parts)

# NEW STREAMING GENERATOR FUNCTION
def get_chatbot_response_stream(db: Session, query: str) -> Generator[str, None, None]:
    """
    Generates a streamed response to a user query using an LLM.
    This function is a generator that yields text chunks.
    """
    context = get_context_for_llm(db)
    prompt = f"""
    You are an AI assistant for a split-expense application called "Even Steven".
    Your task is to answer user questions based on the data context provided below.
    Use only the provided data to answer. Do not make up information.
    Keep your answers concise, friendly, and directly answer the question.

    Here is the current data from the database:
    {context}
    ---

    User's question: "{query}"

    Answer:
    """

    try:
        # Set stream=True to get a streaming response from OpenAI
        stream = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for an expense-splitting app."},
                {"role": "user", "content": prompt}
            ],
            stream=True, 
        )
        
        # Yield each chunk of content as it arrives
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content

    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        yield "Sorry, I encountered an error. Please check the server logs."