from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.user import User as UserModel, UserRole
from app.schemas.user import User, UserCreate

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(auth.require_admin)], # Secure all endpoints in this router
)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(UserModel).order_by(UserModel.id).offset(skip).limit(limit).all()
    return users

@router.post("/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user. Admin only.
    """
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Use email as a temporary ID until the user logs in with Firebase
    user_id = user.email
    db_user = UserModel(id=user_id, email=user.email, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
