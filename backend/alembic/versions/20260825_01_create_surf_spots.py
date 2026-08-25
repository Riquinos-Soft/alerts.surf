"""Create the surf spot catalog table."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260825_01"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "surf_spots",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("region", sa.String(length=120), nullable=False),
        sa.Column("country_code", sa.String(length=2), nullable=False),
        sa.CheckConstraint(
            "char_length(country_code) = 2 AND country_code = upper(country_code)",
            name="ck_surf_spots_country_code",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "name",
            "region",
            "country_code",
            name="uq_surf_spots_catalog_identity",
        ),
    )


def downgrade() -> None:
    op.drop_table("surf_spots")
