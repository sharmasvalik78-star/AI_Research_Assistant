from datetime import datetime
from secrets import token_urlsafe

from sqlalchemy.orm import Session

from models.research_report_share import ResearchReportShare


def create_report_share(
    db: Session,
    user_id: int,
    project_id: int,
    is_public: bool = True,
    allow_download: bool = True,
    expires_at: datetime | None = None,
):
    """
    Creates or replaces a share link for a project.
    """

    existing = (
        db.query(ResearchReportShare)
        .filter(
            ResearchReportShare.user_id == user_id,
            ResearchReportShare.project_id == project_id,
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()

    share = ResearchReportShare(
        user_id=user_id,
        project_id=project_id,
        share_token=token_urlsafe(32),
        is_public=is_public,
        allow_download=allow_download,
        expires_at=expires_at,
    )

    db.add(share)
    db.commit()
    db.refresh(share)

    return share


def get_share_by_token(
    db: Session,
    token: str,
):
    """
    Returns a share record using its token.
    """

    return (
        db.query(ResearchReportShare)
        .filter(
            ResearchReportShare.share_token == token
        )
        .first()
    )


def is_share_valid(
    share: ResearchReportShare,
):
    """
    Returns True when the share link is public
    and has not expired.
    """

    if share is None:
        return False

    if not share.is_public:
        return False

    if share.expires_at is None:
        return True

    return share.expires_at > datetime.utcnow()


def update_share_public_status(
    db: Session,
    share: ResearchReportShare,
    is_public: bool,
):
    """
    Enable or disable public access for a share link.
    """

    share.is_public = is_public

    db.commit()
    db.refresh(share)

    return share


def revoke_report_share(
    db: Session,
    share: ResearchReportShare,
):
    """
    Permanently deletes a share link.
    """

    db.delete(share)
    db.commit()


def increment_access_count(
    db: Session,
    share: ResearchReportShare,
):
    """
    Increments the access counter.
    """

    share.access_count += 1

    db.commit()
    db.refresh(share)

    return share

def update_share_download_status(
    db: Session,
    share: ResearchReportShare,
    allow_download: bool,
):
    """
    Enable or disable downloading for a share link.
    """

    share.allow_download = allow_download

    db.commit()
    db.refresh(share)

    return share