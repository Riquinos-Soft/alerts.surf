import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import CheckConstraint, String, UniqueConstraint, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Mapped, Session, mapped_column

from app.database import Base, get_session

logger = logging.getLogger(__name__)

CATALOG_UNAVAILABLE_MESSAGE = "Surf spot catalog is unavailable"
SURF_SPOT_IDENTITY_CONSTRAINT = "uq_surf_spots_catalog_identity"


class SurfSpot(Base):
    __tablename__ = "surf_spots"
    __table_args__ = (
        UniqueConstraint(
            "name",
            "region",
            "country_code",
            name=SURF_SPOT_IDENTITY_CONSTRAINT,
        ),
        CheckConstraint(
            "char_length(country_code) = 2 AND country_code = upper(country_code)",
            name="ck_surf_spots_country_code",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    region: Mapped[str] = mapped_column(String(120))
    country_code: Mapped[str] = mapped_column(String(2))


class SurfSpotItem(BaseModel):
    name: str
    region: str
    country_code: str


class SurfSpotCatalog(BaseModel):
    spots: list[SurfSpotItem]


router = APIRouter(prefix="/api")


@router.get(
    "/spots",
    response_model=SurfSpotCatalog,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": CATALOG_UNAVAILABLE_MESSAGE
        }
    },
)
def get_surf_spots(
    session: Annotated[Session, Depends(get_session)],
) -> SurfSpotCatalog:
    try:
        spots = session.scalars(
            select(SurfSpot).order_by(SurfSpot.name, SurfSpot.region)
        ).all()
    except SQLAlchemyError as error:
        logger.warning("Surf spot catalog query failed (%s)", type(error).__name__)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=CATALOG_UNAVAILABLE_MESSAGE,
        ) from error

    return SurfSpotCatalog(
        spots=[
            SurfSpotItem(
                name=spot.name,
                region=spot.region,
                country_code=spot.country_code,
            )
            for spot in spots
        ]
    )
