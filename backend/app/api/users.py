from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.user import User as UserModel, UserRole
from app.schemas.user import User, UserCreate, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(auth.require_admin)], # Secure all endpoints in this router
)

@router.get("/", response_model=List[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(UserModel).order_by(UserModel.id).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=User)
async def read_user_me(current_user: UserModel = Depends(auth.get_current_user)):
    """Get the current user's information"""
    return current_user

@router.get("/{user_id}", response_model=User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    """Obtener un usuario específico por su ID"""
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

@router.put("/{user_id}", response_model=User)
def update_user(
    user: UserUpdate, 
    user_id: str = None,  
    db: Session = Depends(get_db)
):
    # If no user_id is provided in the path, try to get it from the request body
    if user_id is None:
        if not hasattr(user, 'id') or not user.id:
            raise HTTPException(
                status_code=400, 
                detail="User ID must be provided either in the URL or in the request body"
            )
        user_id = user.id
    
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update only the fields that were provided in the request
    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

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
    db_user = UserModel(id=user_id, email=user.email, role=user.role, name=user.name, lastname=user.lastname)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
