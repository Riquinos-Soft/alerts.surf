from collections.abc import Sequence

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.spots import SURF_SPOT_IDENTITY_CONSTRAINT, SurfSpot

DEVELOPMENT_SPOTS: Sequence[dict[str, str]] = (
    {"name": "Mundaka", "region": "Bizkaia", "country_code": "ES"},
    {"name": "Pantín", "region": "A Coruña", "country_code": "ES"},
)


def seed_development_spots(session: Session) -> None:
    statement = (
        insert(SurfSpot)
        .values(DEVELOPMENT_SPOTS)
        .on_conflict_do_nothing(constraint=SURF_SPOT_IDENTITY_CONSTRAINT)
    )
    session.execute(statement)


def main() -> None:
    with SessionLocal.begin() as session:
        seed_development_spots(session)


if __name__ == "__main__":
    main()
