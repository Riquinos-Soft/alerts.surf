from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
import os
import secrets

router = APIRouter(prefix="/api/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LogoutResponse(BaseModel):
    message: str

# In-memory store for beta tokens
active_tokens = set()

def get_current_user(token: str = Depends(oauth2_scheme)):
    if token not in active_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return os.environ.get("BETA_USERNAME", "beta")

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):
    beta_username = os.environ.get("BETA_USERNAME")
    beta_password = os.environ.get("BETA_PASSWORD")
    if not beta_username or not beta_password:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Beta authentication is not configured",
        )
    username_matches = secrets.compare_digest(
        request.username.encode(), beta_username.encode()
    )
    password_matches = secrets.compare_digest(
        request.password.encode(), beta_password.encode()
    )
    if username_matches and password_matches:
        token = secrets.token_hex(16)
        active_tokens.add(token)
        return LoginResponse(access_token=token)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Invalid username or password"
    )

@router.post("/logout", response_model=LogoutResponse)
def logout(token: str = Depends(oauth2_scheme)):
    if token not in active_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    active_tokens.remove(token)
    return LogoutResponse(message="Logged out successfully")
