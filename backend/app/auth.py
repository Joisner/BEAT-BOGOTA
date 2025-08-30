from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from .database import get_db
from .models.user import User, UserRole
from sqlalchemy.orm import Session

# This is a placeholder for the actual Firebase authentication.
# In a real application, you would use the firebase-admin SDK to verify the token.
#
# Example of real implementation:
#
# import firebase_admin
# from firebase_admin import auth, credentials
# from .config import settings
#
# cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
# firebase_app = firebase_admin.initialize_app(cred)
#
# async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     try:
#         decoded_token = auth.verify_id_token(token)
#         uid = decoded_token['uid']
#         user = db.query(User).filter(User.id == uid).first()
#         if not user:
#             # Optionally create a new user in your DB here
#             raise HTTPException(status_code=404, detail="User not found in our database")
#         return user
#     except auth.InvalidIdTokenError:
#         raise HTTPException(status_code=401, detail="Invalid Firebase ID token")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Authentication error: {e}")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- MOCKED AUTHENTICATION FOR DEVELOPMENT ---
# This mock function simulates token verification and user lookup.
# It expects a token in the format "Bearer <user_id>:<role>"
# e.g., "Bearer user1:admin" or "Bearer promoter2:promotor"

async def get_current_user_mock(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Mocked dependency to simulate user authentication.
    Pass a token like "Bearer <user_id>:<role>" in the Authorization header.
    Example: "user1:admin"
    """
    try:
        user_id, role_str = token.split(":")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid mock token format. Expected '<user_id>:<role>'."
        )

    # In a real app, you'd verify the token. Here, we just look up the user.
    user = db.query(User).filter(User.id == user_id).first()

    # If user doesn't exist, create a mock user for testing purposes
    if not user:
        try:
            role = UserRole(role_str)
            user = User(id=user_id, email=f"{user_id}@example.com", role=role)
            db.add(user)
            db.commit()
            db.refresh(user)
        except ValueError:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid role '{role_str}' in mock token."
            )

    if user.role.value != role_str:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User role mismatch. Token says '{role_str}', DB says '{user.role.value}'."
        )

    return user

# --- ROLE-BASED ACCESS CONTROL DEPENDENCIES ---

def require_role(required_role: UserRole):
    def role_checker(current_user: User = Depends(get_current_user_mock)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User does not have the required '{required_role.value}' role."
            )
        return current_user
    return role_checker

require_admin = require_role(UserRole.ADMIN)
require_promotor = require_role(UserRole.PROMOTOR)
require_assistant = require_role(UserRole.ASSISTANT)
