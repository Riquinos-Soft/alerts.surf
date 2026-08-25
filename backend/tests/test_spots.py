from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import engine, get_session
from app.main import app
from app.seed_spots import seed_development_spots
from app.spots import CATALOG_UNAVAILABLE_MESSAGE, SurfSpot

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_dependency_overrides() -> Iterator[None]:
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def database_session() -> Iterator[Session]:
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    session.execute(delete(SurfSpot))
    session.flush()

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


def use_database_session(session: Session) -> None:
    app.dependency_overrides[get_session] = lambda: session


def test_spot_catalog_is_empty_without_seeding(database_session: Session) -> None:
    use_database_session(database_session)

    response = client.get("/api/spots")

    assert response.status_code == 200
    assert response.json() == {"spots": []}


def test_spot_catalog_returns_public_fields_in_defined_order(
    database_session: Session,
) -> None:
    database_session.add_all(
        [
            SurfSpot(name="Pantín", region="A Coruña", country_code="ES"),
            SurfSpot(name="Mundaka", region="Bizkaia", country_code="ES"),
            SurfSpot(name="Mundaka", region="A Coruña", country_code="ES"),
        ]
    )
    database_session.flush()
    use_database_session(database_session)

    response = client.get("/api/spots")

    assert response.status_code == 200
    assert response.json() == {
        "spots": [
            {"name": "Mundaka", "region": "A Coruña", "country_code": "ES"},
            {"name": "Mundaka", "region": "Bizkaia", "country_code": "ES"},
            {"name": "Pantín", "region": "A Coruña", "country_code": "ES"},
        ]
    }


def test_development_seed_is_idempotent(database_session: Session) -> None:
    seed_development_spots(database_session)
    seed_development_spots(database_session)
    database_session.flush()

    spots = database_session.scalars(
        select(SurfSpot).order_by(SurfSpot.name, SurfSpot.region)
    ).all()

    assert [(spot.name, spot.region, spot.country_code) for spot in spots] == [
        ("Mundaka", "Bizkaia", "ES"),
        ("Pantín", "A Coruña", "ES"),
    ]


def test_spot_catalog_returns_stable_unavailable_response(
    caplog: pytest.LogCaptureFixture,
) -> None:
    connection_details = "postgresql://catalog-user:secret@database/catalog"

    class FailingSession:
        def scalars(self, statement: object) -> None:
            raise SQLAlchemyError(connection_details)

    app.dependency_overrides[get_session] = lambda: FailingSession()

    response = client.get("/api/spots")

    assert response.status_code == 503
    assert response.json() == {"detail": CATALOG_UNAVAILABLE_MESSAGE}
    assert connection_details not in caplog.text
