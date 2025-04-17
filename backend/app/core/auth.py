from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from fastapi import HTTPException, status
from uuid import UUID

from app.core.config import settings
from app.models.user import User

class TokenManager:
    """
    Clase para manejar la generación y validación de tokens JWT
    """
    
    @staticmethod
    def create_token(
        user: User,
        token_type: str = "access",
        expires_delta: Optional[timedelta] = None
    ) -> Dict[str, str]:
        """
        Crea un token JWT con claims específicos basados en el tipo de token
        """
        if expires_delta is None:
            expires_delta = (
                timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
                if token_type == "access"
                else timedelta(days=7)  # refresh token dura 7 días
            )

        # Claims estándar de JWT
        to_encode = {
            "sub": str(user.id),  # subject (ID del usuario)
            "email": user.email,
            "type": token_type,
            "iat": datetime.utcnow(),  # issued at
            "exp": datetime.utcnow() + expires_delta,  # expiration
            "is_superadmin": user.is_superadmin,
            "is_active": user.is_active,
            "jti": str(UUID.uuid4())  # unique token ID
        }

        # Firma el token con el algoritmo especificado
        encoded_jwt = jwt.encode(
            to_encode,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )

        return {
            "token": encoded_jwt,
            "token_type": token_type,
            "expires_in": int(expires_delta.total_seconds())
        }

    @staticmethod
    def create_tokens(user: User) -> Dict[str, Any]:
        """
        Crea tanto el access token como el refresh token
        """
        access_token = TokenManager.create_token(user, "access")
        refresh_token = TokenManager.create_token(user, "refresh")
        
        return {
            "access_token": access_token["token"],
            "refresh_token": refresh_token["token"],
            "token_type": "bearer",
            "expires_in": access_token["expires_in"]
        }

    @staticmethod
    def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
        """
        Verifica y decodifica un token JWT
        """
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            
            # Verificaciones adicionales
            if payload.get("type") != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Token type mismatch. Expected {token_type}",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Verificar si el token está en la lista negra (si implementas revocación)
            # if is_token_revoked(payload.get("jti")):
            #     raise HTTPException(...)

            return payload

        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Could not validate credentials: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

    @staticmethod
    def refresh_access_token(refresh_token: str) -> Dict[str, str]:
        """
        Genera un nuevo access token usando un refresh token válido
        """
        payload = TokenManager.verify_token(refresh_token, "refresh")
        
        # Aquí deberías obtener el usuario de la base de datos
        # user = get_user_by_id(payload.get("sub"))
        # return TokenManager.create_token(user, "access")
        
        # Por ahora, solo devolvemos un nuevo token con los mismos claims
        new_token = TokenManager.create_token({
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "is_superadmin": payload.get("is_superadmin"),
            "is_active": payload.get("is_active")
        }, "access")
        
        return new_token 