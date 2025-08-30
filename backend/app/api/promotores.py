from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.promotor import Promotor as PromotorModel
from app.models.user import User as UserModel, UserRole
from app.schemas.promotor import Promotor, PromotorCreate, PromotorUpdate

router = APIRouter(
    prefix="/promotores",
    tags=["Promotores"],
)

@router.post("/", response_model=Promotor, status_code=status.HTTP_201_CREATED)
def create_promotor(
    promotor: PromotorCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Create a new promotor. This also assigns the 'promotor' role to the associated user.
    Only accessible to admins.
    """
    # Check if the user exists
    db_user = db.query(UserModel).filter(UserModel.id == promotor.user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail=f"User with id {promotor.user_id} not found.")

    # Check if a promotor profile already exists for this user
    existing_promotor = db.query(PromotorModel).filter(PromotorModel.user_id == promotor.user_id).first()
    if existing_promotor:
        raise HTTPException(status_code=400, detail="A promotor profile already exists for this user.")

    # Create the promotor record
    # Note: The promotor ID should be the same as the user ID for consistency
    db_promotor = PromotorModel(id=promotor.user_id, **promotor.model_dump())

    # Update the user's role to 'promotor'
    db_user.role = UserRole.PROMOTOR

    db.add(db_promotor)
    db.add(db_user)
    db.commit()
    db.refresh(db_promotor)
    return db_promotor

@router.get("/", response_model=List[Promotor])
def read_promotores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all promotores.
    """
    promotores = db.query(PromotorModel).offset(skip).limit(limit).all()
    return promotores

@router.get("/{promotor_id}", response_model=Promotor)
def read_promotor(promotor_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a single promotor by their ID.
    """
    db_promotor = db.query(PromotorModel).filter(PromotorModel.id == promotor_id).first()
    if db_promotor is None:
        raise HTTPException(status_code=404, detail="Promotor not found")
    return db_promotor

@router.put("/{promotor_id}", response_model=Promotor)
def update_promotor(
    promotor_id: str,
    promotor: PromotorUpdate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Update an existing promotor. Only accessible to admins.
    """
    db_promotor = read_promotor(promotor_id, db)
    update_data = promotor.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_promotor, key, value)
    db.add(db_promotor)
    db.commit()
    db.refresh(db_promotor)
    return db_promotor

@router.delete("/{promotor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_promotor(
    promotor_id: str,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.require_admin)
):
    """
    Delete a promotor. This does not delete the user, but can optionally reset their role.
    For now, we just delete the promotor profile.
    Only accessible to admins.
    """
    db_promotor = read_promotor(promotor_id, db)
    db.delete(db_promotor)
    db.commit()
    return None
