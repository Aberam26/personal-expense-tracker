import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    create_engine, Integer, String, Float, DateTime, select, desc, func
)
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing from .env")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


class Base(DeclarativeBase):
    pass


class ExpenseDB(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=lifespan)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    created_at: Optional[datetime] = None


def expense_to_dict(expense: ExpenseDB):
    return {
        "id": expense.id,
        "title": expense.title,
        "amount": expense.amount,
        "category": expense.category,
        "created_at": expense.created_at.isoformat() if expense.created_at else None,
    }


@app.get("/")
def home():
    return {"message": "Expense Tracker API is running"}


@app.post("/expenses", status_code=201)
def create_expense(expense: ExpenseCreate):
    with Session(engine) as db:
        expense_dict = expense.model_dump()
        if expense_dict.get("created_at") is None:
            expense_dict["created_at"] = datetime.now(timezone.utc)
        new_expense = ExpenseDB(**expense_dict)
        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)
        return expense_to_dict(new_expense)


@app.get("/expenses")
def get_expenses():
    with Session(engine) as db:
        records = db.scalars(
            select(ExpenseDB).order_by(desc(ExpenseDB.created_at), desc(ExpenseDB.id))
        ).all()
        return [expense_to_dict(item) for item in records]


@app.get("/expenses/highest")
def get_highest_expense():
    with Session(engine) as db:
        highest = db.scalar(
            select(ExpenseDB)
            .order_by(desc(ExpenseDB.amount))
            .limit(1)
        )

        if highest is None:
            raise HTTPException(
                status_code=404,
                detail="No expenses found. Create an expense first."
            )

        return expense_to_dict(highest)

# GET: Retrieve one expense by ID
@app.get("/expenses/{expense_id}")
def get_expense_by_id(expense_id: int):
    with Session(engine) as db:
        expense = db.get(ExpenseDB, expense_id)

        if expense is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        return expense_to_dict(expense)


# PUT: Update an existing expense
@app.put("/expenses/{expense_id}")
def update_expense(expense_id: int, expense: ExpenseCreate):
    with Session(engine) as db:
        db_expense = db.get(ExpenseDB, expense_id)

        if db_expense is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        db_expense.title = expense.title
        db_expense.amount = expense.amount
        db_expense.category = expense.category
        if expense.created_at is not None:
            db_expense.created_at = expense.created_at
        db.commit()
        db.refresh(db_expense)
        return expense_to_dict(db_expense)


# DELETE: Delete an expense by ID
@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int):
    with Session(engine) as db:
        db_expense = db.get(ExpenseDB, expense_id)

        if db_expense is None:
            raise HTTPException(
                status_code=404,
                detail="Expense not found"
            )

        db.delete(db_expense)
        db.commit()
        return {"message": "Expense deleted successfully", "id": expense_id}

