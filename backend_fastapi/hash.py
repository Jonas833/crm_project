import bcrypt
from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "sudwjidsdjoemc2xoskdmci234uendxijmiencnhiexm25372"
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_access_token(username: str, expires_minutes: int = 60):
    payload = {
        "sub": username,
        "exp": datetime.utcnow() + timedelta(minutes=expires_minutes)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
