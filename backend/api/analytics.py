from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.session import get_db

from core.auth import get_current_user

from models.user import User

from services.analytics_service import (
    get_analytics_overview,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/overview")
def analytics_overview(
    days: int = Query(30, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns analytics overview for the authenticated user.
    """

    return get_analytics_overview(
        db=db,
        user=current_user,
        days=days,
    )