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
async def get_current_user_mock(token: str = Depends(oauth2_scheme)):
    """
    Modified mock dependency that simulates user authentication without DB writes.
    It creates an in-memory user object.
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

    try:
        # Validate the role from the token
        role = UserRole(role_str)
    except ValueError:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{role_str}' in mock token. Must be one of {', '.join([r.value for r in UserRole])}."
        )

    # Create an in-memory User object. No database interaction.
    mock_user = User(id=user_id, email=f"{user_id}@example.com", role=role)

    return mock_user

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
