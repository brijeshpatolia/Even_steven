## web-app is live :- https://even-steven.vercel.app




# Even_Steven - Splitwise Clone

**Even_Steven** is a full-stack expense sharing app (like Splitwise) built as part of the Neurix Full-Stack SDE Intern assignment. It allows users to create groups, log shared expenses, and calculate who owes whom, with a modern frontend and robust backend with chatbot functionality .

## Tech Stack

### Backend
- Framework: FastAPI  
- Database: PostgreSQL  
- ORM: SQLAlchemy  
- Validation: Pydantic  
- Server: Uvicorn  
- AI Assistant: OpenAI integration  
- Containerization: Docker, Docker Compose  

### Frontend
- Framework: React (Vite)  
- Styling: TailwindCSS  
- Routing: React Router DOM  
- Data Fetching: TanStack Query  
- API Client: Axios  

## Project Structure

```
Even_Steven/
├── backend/
│   ├── app/
│   │   ├── api/         # Routes and endpoints
│   │   ├── core/        # App configs
│   │   ├── crud/        # Database CRUD operations
│   │   ├── db/          # DB models and session
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic (balances, chatbot)
│   │   └── main.py      # FastAPI app entry
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios API clients
│   │   ├── components/  # Atomic UI components
│   │   ├── pages/       # App pages
│   │   └── main.jsx     # Root setup
├── docker-compose.yml
```

## Running the Application

### Option 1: Run with Docker (Recommended)

> Runs both frontend and backend with a single command.

**Requirements**:
- Docker Desktop installed and running

**Steps**:
```bash
# From project root
docker-compose up --build
```

- Backend: http://localhost:8000  
- Frontend: http://localhost:3000  
- API Docs: http://localhost:8000/docs  

### Option 2: Run Locally Without Docker

#### Backend Setup

**Requirements**:
- Python 3.11+
- PostgreSQL running (local/cloud)

**Steps**:
```bash
cd backend
python -m venv venv

# Activate virtualenv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Create `.env` in `backend/`**:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
OPENAI_API_KEY="your_openai_key_here"
```

**Run server**:
```bash
uvicorn app.main:app --reload
```

#### Frontend Setup

**Requirements**:
- Node.js + npm

**Steps**:
```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173`
### plz change the base url in the frontend/src/api/apiClient  to  'http://localhost:8000/api/v1'

## Features

### Backend
- Group creation & member management
- Add expenses with equal or percentage split logic
- Calculate simplified "who owes whom" balances
- User-wise balance summary
- Conversational AI Assistant for expense queries
- Robust data validation & error handling
- Swagger UI at `/docs`

### Frontend
- Responsive, real-time UI with React + TailwindCSS
- Dashboard to manage groups & track balances
- Add group and expenses with intuitive forms
- User-wise and group-wise balance viewer
- Built-in Chatbot to ask financial queries in plain English
- Real-time updates via TanStack Query

## Seed Data

On startup, the database is seeded with:

### Users
- 101, 102, 103, 104

### Group: Road Trip
- Members: 101, 102, 103
- Expenses:
  - "Gas": $80 by 101
  - "Snacks": $45 by 102
- Split: equal
- Outcome:
  - Each owes ≈ $41.67
  - 103 owes 101 and 102
  - 101 and 102 are owed

### Group: Apartment Rent
- Members: 101, 104
- Expense:
  - "Monthly Rent": $1200 by 101
- Split: percentage (60% 101, 40% 104)
- Outcome:
  - 104 owes 101 $480

## API Reference

### Group Management
```http
POST /api/v1/groups/
```
```json
{
  "name": "Trip to Goa",
  "users": [101, 102]
}
```

### Expense Management
```http
POST /api/v1/groups/{group_id}/expenses/
```
```json
{
  "description": "Dinner",
  "amount": 100.0,
  "paid_by_user_id": 101,
  "split_type": "equal",
  "splits": {
    "101": 60,
    "102": 40
  }
}
```

### Balances
```http
GET /api/v1/balances/group/{group_id}
```
```http
GET /api/v1/users/{user_id}/balances
```

### Chatbot
```http
POST /api/v1/chatbot/
```
```json
{
  "query": "How much does user 103 owe?"
}
```

## Assumptions

- Users are created automatically when added to a group/expense.
- Group names are unique.
- The app tracks debts only, no settlement functionality yet.

## Future Enhancements

- Add debt settlement tracking
- Auth and login for users
- Mobile responsiveness improvements
- Graphical financial insights
