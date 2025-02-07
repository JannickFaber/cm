from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext

# Geheimschlüssel für JWT
SECRET_KEY = "mein_geheimer_schlüssel"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Passwort-Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# FastAPI OAuth2 Schema (Token wird per Header übermittelt)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    """Vergleicht das eingegebene Passwort mit dem gespeicherten Hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Erzeugt einen Hash für das Passwort."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Erstellt ein JWT-Token mit einer Ablaufzeit."""
    to_encode = data.copy()
    expire = datetime.now(datetime.timezone.utc) + (expires_delta if expires_delta else timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    """Dekodiert und überprüft das JWT-Token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token abgelaufen")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Ungültiges Token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Validiert das Token und gibt die Benutzerinformationen zurück."""
    payload = decode_access_token(token)
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Ungültiges Token")
    return {"username": username}  # Hier könnte man echte Benutzerdaten aus einer DB laden