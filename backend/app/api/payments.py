import mercadopago
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import auth
from app.config import settings
from app.database import get_db
from app.models.transaction import Transaction as TransactionModel
from app.schemas.payment import PaymentCreate, PaymentResponse

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)

@router.post("/process", response_model=PaymentResponse)
def process_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: auth.User = Depends(auth.get_current_user_mock)
):
    """
    Process a payment using a token from the frontend.
    This endpoint simulates the interaction with the Mercado Pago SDK.
    """

    # In a real application, you would initialize the SDK like this:
    # sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    # And then make the API call:
    # payment_data_dict = {
    #     "transaction_amount": payment_data.transaction_amount,
    #     "token": payment_data.token,
    #     "description": payment_data.description,
    #     "installments": payment_data.installments,
    #     "payment_method_id": payment_data.payment_method_id,
    #     "issuer_id": payment_data.issuer_id,
    #     "payer": {
    #         "email": payment_data.payer.email,
    #         "identification": {
    #             "type": payment_data.payer.identification.type,
    #             "number": payment_data.payer.identification.number
    #         }
    #     }
    # }
    # payment_response = sdk.payment().create(payment_data_dict)

    # if payment_response["status"] != 201:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail=payment_response["response"]["message"]
    #     )

    # payment_info = payment_response["response"]

    # --- MOCKED SDK RESPONSE ---
    # This block simulates a successful response from the Mercado Pago API.
    print("--- Simulating Mercado Pago API Call ---")
    mock_payment_id = int(uuid.uuid4().int & (1<<31)-1) # A random positive int
    mock_payment_info = {
        "id": mock_payment_id,
        "status": "approved",
        "status_detail": "accredited",
        "transaction_amount": payment_data.transaction_amount,
        "date_approved": "2025-08-30T12:30:00.000-04:00",
        "payer": {"email": payment_data.payer.email}
    }
    print(f"--- Mock payment created with ID: {mock_payment_id} ---")
    # --- END MOCKED SDK RESPONSE ---

    # Save the transaction to the database
    db_transaction = TransactionModel(
        user_id=current_user.id,
        mercado_pago_id=str(mock_payment_info["id"]),
        status=mock_payment_info["status"],
        amount=mock_payment_info["transaction_amount"],
        description=payment_data.description,
        # In a real scenario, you might store more details from the payment
        purchase_details=payment_data.model_dump()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return PaymentResponse(
        id=mock_payment_info["id"],
        status=mock_payment_info["status"],
        status_detail=mock_payment_info["status_detail"],
        transaction_amount=mock_payment_info["transaction_amount"],
        date_approved=mock_payment_info["date_approved"],
        payer_email=mock_payment_info["payer"]["email"]
    )
