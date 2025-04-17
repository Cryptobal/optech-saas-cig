from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User as UserModel
from app.schemas.user import User, UserCreate
from app.services.auth import authenticate_user, get_current_user
from app.core.auth import TokenManager

router = APIRouter()

@router.post("/signup", response_model=User)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = UserModel.get_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    return UserModel.create(db=db, obj_in=user)

@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generar tokens
    tokens = TokenManager.create_tokens(user)
    
    # Configurar cookie segura para el refresh token
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        httponly=True,
        secure=not settings.DEBUG,  # True en producción
        samesite="lax",
        max_age=7 * 24 * 60 * 60  # 7 días
    )
    
    return {
        "access_token": tokens["access_token"],
        "token_type": tokens["token_type"],
        "expires_in": tokens["expires_in"]
    }

@router.post("/refresh")
def refresh_token(
    response: Response,
    refresh_token: str = Depends(lambda x: x.cookies.get("refresh_token"))
):
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    # Generar nuevo access token
    new_tokens = TokenManager.refresh_access_token(refresh_token)
    
    # Actualizar cookie del refresh token
    response.set_cookie(
        key="refresh_token",
        value=new_tokens["refresh_token"],
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "access_token": new_tokens["access_token"],
        "token_type": new_tokens["token_type"],
        "expires_in": new_tokens["expires_in"]
    }

@router.post("/logout")
def logout(response: Response):
    """
    Invalida el refresh token eliminando la cookie
    """
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=not settings.DEBUG,
        samesite="lax"
    )
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=User)
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user 