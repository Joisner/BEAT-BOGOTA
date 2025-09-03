from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import auth
from app.database import get_db
from app.models.descuento import Discount as DiscountModel
from app.schemas.descuento import Discount, DiscountCreate, DiscountUpdate

router = APIRouter(
    prefix="/discounts",
    tags=["Discounts"],
    dependencies=[Depends(auth.require_admin)], # Secure all endpoints in this router
)

@router.post("/", response_model=Discount, status_code=status.HTTP_201_CREATED)
def create_discount(discount: DiscountCreate, db: Session = Depends(get_db)):
    """
    Create a new discount. Admin only.
    """
    db_discount = DiscountModel(**discount.model_dump())
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount

@router.get("/", response_model=List[Discount])
def read_discounts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all discounts. Admin only.
    """
    discounts = db.query(DiscountModel).offset(skip).limit(limit).all()
    return discounts

@router.get("/{discount_id}", response_model=Discount)
def read_discount(discount_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single discount by its ID. Admin only.
    """
    db_discount = db.query(DiscountModel).filter(DiscountModel.id == discount_id).first()
    if db_discount is None:
        raise HTTPException(status_code=404, detail="Discount not found")
    return db_discount

@router.put("/{discount_id}", response_model=Discount)
def update_discount(discount_id: int, discount: DiscountUpdate, db: Session = Depends(get_db)):
    """
    Update an existing discount. Admin only.
    """
    db_discount = read_discount(discount_id, db)
    update_data = discount.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_discount, key, value)
    db.add(db_discount)
    db.commit()
    db.refresh(db_discount)
    return db_discount

@router.delete("/{discount_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_discount(discount_id: int, db: Session = Depends(get_db)):
    """
    Delete a discount. Admin only.
    """
    db_discount = read_discount(discount_id, db)
    db.delete(db_discount)
    db.commit()
    return None
