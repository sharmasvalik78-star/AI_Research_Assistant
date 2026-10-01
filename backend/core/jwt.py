from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

from core.config import (
    SECRET_KEY,
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)


def create_access_token(data: dict):
    print("CREATE SECRET_KEY:", SECRET_KEY)

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


def verify_access_token(token: str):
    print("VERIFY SECRET_KEY:", SECRET_KEY)

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        print("JWT PAYLOAD:", payload)

        return payload

    except JWTError as e:
        print("JWT ERROR:", str(e))
        return None