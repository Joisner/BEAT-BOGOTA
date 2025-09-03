from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.promotor import Promoter as PromoterModel
from app.models.user import User as UserModel, UserRole
from app.schemas.promotor import Promoter, PromoterCreate, PromoterUpdate

router = APIRouter(
    prefix="/promoters",
    tags=["Promoters"],
)

@router.post("/", response_model=Promoter, status_code=status.HTTP_201_CREATED)
def create_promoter(
    promoter: PromoterCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Create a new promoter. This also assigns the 'promoter' role to the associated user.
    Only accessible to admins.
    """
    # Check if the user exists
    db_user = db.query(UserModel).filter(UserModel.email == promoter.user_email).first()
    if not db_user:
        raise HTTPException(status_code=404, detail=f"User with email {promoter.user_email} not found.")

    # Check if a promoter profile already exists for this user
    existing_promoter = db.query(PromoterModel).filter(PromoterModel.user_id == db_user.id).first()
    if existing_promoter:
        raise HTTPException(status_code=400, detail="A promoter profile already exists for this user.")

    # Create the promoter record
    promoter_data = promoter.model_dump()
    promoter_data.pop("user_email")  # Remove the email from the data to be passed to the model
    db_promoter = PromoterModel(id=db_user.id, user_id=db_user.id, **promoter_data)

    # Update the user's role to 'promoter'
    db_user.role = UserRole.PROMOTER

    db.add(db_promoter)
    db.add(db_user)
    db.commit()
    db.refresh(db_promoter)
    return db_promoter

@router.get("/", response_model=List[Promoter])
def read_promoters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all promoters.
    """
    promoters = db.query(PromoterModel).order_by(PromoterModel.id).offset(skip).limit(limit).all()
    return promoters

@router.get("/{promoter_id}", response_model=Promoter)
def read_promoter(promoter_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a single promoter by their ID.
    """
    db_promoter = db.query(PromoterModel).filter(PromoterModel.id == promoter_id).first()
    if db_promoter is None:
        raise HTTPException(status_code=404, detail="Promoter not found")
    return db_promoter

@router.put("/{promoter_id}", response_model=Promoter)
def update_promoter(
    promoter_id: str,
    promoter: PromoterUpdate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Update an existing promoter. Only accessible to admins.
    """
    db_promoter = read_promoter(promoter_id, db)
    update_data = promoter.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_promoter, key, value)
    db.add(db_promoter)
    db.commit()
    db.refresh(db_promoter)
    return db_promoter

@router.delete("/{promoter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promoter(
    promoter_id: str,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Delete a promoter. This does not delete the user, but can optionally reset their role.
    For now, we just delete the promoter profile.
    Only accessible to admins.
    """
    db_promoter = read_promoter(promoter_id, db)
    db.delete(db_promoter)
    db.commit()
    return None
