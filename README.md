# Even_Steven - Backend

This directory contains the backend service for the Even_Steven application, a simplified clone of Splitwise built as part of the Neurix Full-Stack SDE Intern application assignment.

The backend is a robust, modular API built with Python, FastAPI, and PostgreSQL, designed to handle group creation, expense management, and complex balance calculations. It is fully containerized with Docker for easy setup and deployment.

---

## Key Features

* **Group Management**: Create groups and manage members by name and User_Id.
* **Expense Tracking**: Add expenses to groups with detailed descriptions and amounts.
* **Advanced Splitting Logic**: Supports both "equal" and "percentage" based expense splitting.
* **Balance Calculation**: Sophisticated logic to calculate a simplified list of who owes whom within a group.
* **User-Centric Balances**: Provides an overall financial summary for any user across all their groups.
* **AI-Powered Chatbot**: Integrated a conversational AI assistant that can answer questions about groups, expenses, and members based on the current data in the database.
* **Robust Validation**: Integrated data validation to handle invalid inputs and edge cases gracefully.
* **Interactive API Docs**: To test the API, navigate to `http://localhost:8000/docs` for a full Swagger UI.
* **Dockerized**: Fully containerized for one-command setup and consistent runtime environments.

## Tech Stack

-   **Framework**: FastAPI
-   **Database**: PostgreSQL
-   **ORM**: SQLAlchemy
-   **Data Validation**: Pydantic
-   **AI Integration**: OpenAI
-   **Server**: Uvicorn
-   **Containerization**: Docker & Docker Compose

---

## Running the Application

There are two ways to run the backend: using Docker (recommended for ease of use) or setting up a local Python environment.

### 1. Using Docker (Recommended)

This is the simplest way to run the entire full-stack application.

**Prerequisites**:
-   Docker Desktop installed and running.

**Instructions**:
1.  Navigate to the **root** directory of the `Even_Steven` project (the folder containing `backend` and `frontend`).
2.  Run the following single command:
    ```bash
    docker-compose up --build
    ```
3.  The backend API will be available at `http://localhost:8000`. The interactive API documentation (Swagger UI) can be accessed at `http://localhost:8000/docs`.

### 2. Local Python Environment Setup

**Prerequisites**:
-   Python 3.11+
-   A running PostgreSQL server (e.g., local installation or a cloud service like NeonDB).

**Instructions**:
1.  **Navigate to the `backend` directory.**
2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    # On Windows
    .\venv\Scripts\activate
    # On macOS/Linux
    source venv/bin/activate
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables:**
    -   Create a file named `.env` in the `backend` directory.
    -   Add your PostgreSQL database connection string and OpenAI API key to it:
        ```env
        DATABASE_URL="postgresql://user:password@host:port/dbname"
        OPENAI_API_KEY="your_openai_api_key_here"
        ```
5.  **Run the server:**
    ```bash
    uvicorn app.main:app --reload
    ```
6.  The API will be available at `http://localhost:8000`.

---

## Examples / Seed Data

To demonstrate the application's features, the database is seeded with initial data. This helps in understanding how data is structured and interpreted by the API.

### Users

Four users are automatically created with the following IDs: `101`, `102`, `103`, and `104`.

### Group 1: "Road Trip"

* **Members**: `101`, `102`, `103`.
* **Expenses**:
    * "Gas": $80.00, paid by User `101`.
    * "Snacks": $45.00, paid by User `102`.
* **Interpretation**:
    * The total expense for the group is $125.00.
    * Since the split type is `equal`, this total is divided among 3 members, meaning each person's share is approximately $41.67.
    * The balance calculation service will determine that:
        * User `103` owes $41.67.
        * User `102` is owed $3.33 ($45.00 - $41.67).
        * User `101` is owed $38.33 ($80.00 - $41.67).
    * The `GET /api/v1/balances/group/Road Trip` endpoint simplifies this to show that User `103` should pay User `101` and User `102` to settle up.

### Group 2: "Apartment Rent"

* **Members**: `101`, `104`.
* **Expense**:
    * "Monthly Rent": $1200.00, paid entirely by User `101`.
* **Interpretation**:
    * This expense uses a `percentage` split: User `101` is responsible for 60% and User `104` for 40%.
    * User `104`'s share is 40% of $1200.00, which is $480.00.
    * Since User `101` paid the full amount, the balance calculation will show a single transaction: **User `104` owes User `101` $480.00**.

---

## Project Structure

The backend follows a professional, modular structure to ensure a clean separation of concerns, making the codebase highly readable and maintainable.

app/
├── api/          # Main router and endpoint definitions
│   ├── endpoints/  # Individual feature endpoints (groups, users, chatbot, etc.)
│   └── router.py   # Aggregates all endpoint routers
├── core/         # Application configuration (e.g., .env loading)
├── crud/         # CRUD (Create, Read, Update, Delete) database functions
├── db/           # Database models (SQLAlchemy) and session management
├── schemas/      # Pydantic schemas for data validation and serialization
├── services/     # Business logic (e.g., balance calculation, chatbot service)
└── main.py       # Main FastAPI application entry point

## API Documentation

The API is fully documented using OpenAPI standards. Interactive documentation is automatically generated by FastAPI and can be accessed at the `/docs` endpoint when the server is running.

### Key Endpoints

#### Group Management
-   `POST /api/v1/groups/`
    -   Creates a new group.
    -   **Body**: `{ "name": "string", "users": [101, 102, ...] }`
-   `GET /api/v1/groups/`
    -   Retrieves a list of all groups.

#### Expense Management
-   `POST /api/v1/groups/{group_name}/expenses/`
    -   Adds a new expense to a group.
    -   **Body**: `{ "description": "string", "amount": float, "paid_by_user_id": int, "split_type": "string", "splits": {} }`

#### Balance Tracking
-   `GET /api/v1/balances/group/{group_name}`
    -   Gets the simplified list of who owes whom for a specific group.
-   `GET /api/v1/users/{user_id}/balances`
    -   Gets a financial summary for a user across all their groups.

#### Chatbot
- `POST /api/v1/chatbot/`
    - Interacts with the AI assistant.
    - **Body**: `{"query": "your question here"}`

---

## Assumptions Made

-   **User Creation**: For simplicity, users are created automatically by their ID if they do not exist when a group is created or an expense is added.
-   **Unique Names**: Group names are considered unique identifiers in the API for user-friendliness.
-   **No Settlements**: The application tracks debts but does not include functionality to "settle up" or record payments between users.
