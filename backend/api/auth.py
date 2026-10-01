from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.session import get_db
from models.user import User
from core.auth import get_current_user

from schemas.user import (
    UserRegister,
    UserResponse,
    UserLogin,
    Token,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

from services.auth_service import (
    create_user,
    login_user,
    request_password_reset,
    reset_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    created_user = create_user(db, user)

    if created_user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    return created_user


@router.post(
    "/login",
    response_model=Token,
)
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    token = login_user(
        db,
        user.email,
        user.password,
    )

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return token

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user

@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    reset_token = request_password_reset(
        db,
        request.email,
    )

    return {
        "message": "If the email exists, a password reset link has been requested."
    }

@router.post("/reset-password")
def reset_password_route(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    success = reset_password(
        db,
        request.token,
        request.new_password,
    )

    if not success:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired password reset token.",
        )

    return {
        "message": "Password reset successfully."
    }