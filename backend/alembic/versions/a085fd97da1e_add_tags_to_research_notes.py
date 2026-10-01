"""add_tags_to_research_notes

Revision ID: a085fd97da1e
Revises: 4d0084ef049a
Create Date: 2026-07-14 20:37:31.032760

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a085fd97da1e"
down_revision: Union[str, Sequence[str], None] = "4d0084ef049a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "research_notes",
        sa.Column(
            "tags",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'::json"),
        ),
    )

    op.alter_column(
        "research_notes",
        "tags",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        "research_notes",
        "tags",
    )