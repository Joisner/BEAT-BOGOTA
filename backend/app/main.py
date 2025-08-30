from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import events, promotores, etapas, descuentos, payments
from . import auth

app = FastAPI(title="Beat Bogotá API")

# CORS Middleware
origins = [
    "http://localhost",
    "http://localhost:4200", # Default Angular dev port
    # Add the production frontend URL here when available
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(events.router)
app.include_router(promotores.router)
app.include_router(etapas.router)
app.include_router(descuentos.router)
app.include_router(payments.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Beat Bogotá API"}

# A protected endpoint that requires any authenticated user
@app.get("/users/me")
def read_users_me(current_user: User = Depends(auth.get_current_user_mock)):
    return {"user_id": current_user.id, "email": current_user.email, "role": current_user.role}

# An admin-only endpoint
@app.get("/admin/dashboard")
def read_admin_dashboard(current_user: User = Depends(auth.require_admin)):
    return {"message": f"Welcome Admin {current_user.email}!", "role": current_user.role}

# A promoter-only endpoint
@app.get("/promoter/info")
def read_promoter_info(current_user: User = Depends(auth.require_promotor)):
    return {"message": f"Welcome Promoter {current_user.email}!", "role": current_user.role}
