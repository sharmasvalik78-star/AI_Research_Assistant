from sqlalchemy.orm import Session

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from models.password_reset_token import PasswordResetToken
from models.user import User
from schemas.user import UserRegister
from core.security import hash_password, verify_password
from core.jwt import create_access_token
from core.config import FRONTEND_URL
from services.email_service import send_password_reset_email


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserRegister):
    # Check if user already exists
    existing_user = get_user_by_email(db, user.email)

    if existing_user:
        return None

    # Create new user
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user

def login_user(db: Session, email: str, password: str):
    user = authenticate_user(db, email, password)

    if not user:
        return None

    access_token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

def create_password_reset_token(db: Session, user: User):
    raw_token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    reset_token = PasswordResetToken(
        user_id=user.id,
        token_hash=token_hash,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=30),
    )

    db.add(reset_token)
    db.commit()

    return raw_token


def request_password_reset(db: Session, email: str):
    user = get_user_by_email(db, email)

    if not user:
        return None

    raw_token = create_password_reset_token(db, user)

    reset_url = f"{FRONTEND_URL}/reset-password?token={raw_token}"

    send_password_reset_email(
        user.email,
        reset_url,
    )

    return raw_token

def reset_password(db: Session, token: str, new_password: str):
    token_hash = hashlib.sha256(
        token.encode("utf-8")
    ).hexdigest()

    reset_token = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used == False,
        )
        .first()
    )

    if not reset_token:
        return False

    if reset_token.expires_at < datetime.now(timezone.utc):
        return False

    user = db.query(User).filter(
        User.id == reset_token.user_id
    ).first()

    if not user:
        return False

    user.hashed_password = hash_password(new_password)
    reset_token.used = True

    db.commit()

    return True