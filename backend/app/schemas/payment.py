from pydantic import BaseModel
from typing import Optional

class PayerIdentification(BaseModel):
    type: str
    number: str

class Payer(BaseModel):
    email: str
    identification: PayerIdentification

class PaymentCreate(BaseModel):
    token: str
    issuer_id: str
    payment_method_id: str
    transaction_amount: float
    installments: int
    description: str
    payer: Payer

class PaymentResponse(BaseModel):
    id: int
    status: str
    status_detail: str
    transaction_amount: float
    date_approved: Optional[str] = None
    payer_email: str
