from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.user import User

from services.research_report_share_service import (
    create_report_share,
    get_share_by_token,
    update_share_public_status,
    update_share_download_status,
    revoke_report_share,
)

router = APIRouter(
    prefix="/research-report-shares",
    tags=["Research Report Shares"],
)


@router.post("/{project_id}")
def create_share(
    project_id: int,
    is_public: bool = True,
    allow_download: bool = True,
    expires_at: Optional[datetime] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create or replace a share link for a project.
    """

    share = create_report_share(
        db=db,
        user_id=current_user.id,
        project_id=project_id,
        is_public=is_public,
        allow_download=allow_download,
        expires_at=expires_at,
    )

    return {
        "message": "Share link created successfully.",
        "share_token": share.share_token,
        "is_public": share.is_public,
        "allow_download": share.allow_download,
        "access_count": share.access_count,
        "expires_at": share.expires_at,
    }


@router.get("/token/{share_token}")
def get_share(
    share_token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns share information.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if share.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access this share link.",
        )

    return {
        "project_id": share.project_id,
        "share_token": share.share_token,
        "is_public": share.is_public,
        "allow_download": share.allow_download,
        "access_count": share.access_count,
        "expires_at": share.expires_at,
        "created_at": share.created_at,
    }


@router.patch("/{share_token}/public")
def update_public_status(
    share_token: str,
    is_public: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Enable or disable public access for a share link.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if share.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to modify this share link.",
        )

    share = update_share_public_status(
        db=db,
        share=share,
        is_public=is_public,
    )

    return {
        "message": "Share status updated successfully.",
        "share_token": share.share_token,
        "is_public": share.is_public,
        "access_count": share.access_count,
    }


@router.patch("/{share_token}/download")
def update_download_status(
    share_token: str,
    allow_download: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Enable or disable downloading for a share link.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if share.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to modify this share link.",
        )

    share = update_share_download_status(
        db=db,
        share=share,
        allow_download=allow_download,
    )

    return {
        "message": "Download permission updated successfully.",
        "share_token": share.share_token,
        "allow_download": share.allow_download,
    }



@router.delete("/{share_token}")
def revoke_share(
    share_token: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Permanently revoke a share link.
    """

    share = get_share_by_token(
        db=db,
        token=share_token,
    )

    if share is None:
        raise HTTPException(
            status_code=404,
            detail="Share not found.",
        )

    if share.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to revoke this share link.",
        )

    revoke_report_share(
        db=db,
        share=share,
    )

    return {
        "message": "Share link revoked successfully.",
    }