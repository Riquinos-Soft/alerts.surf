from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient

from app.database import engine, is_database_available
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_dependency_overrides() -> Iterator[None]:
    yield
    app.dependency_overrides.clear()


def test_database_probe_uses_postgresql_and_releases_connection() -> None:
    assert engine.pool.checkedout() == 0

    assert is_database_available() is True

    assert engine.pool.checkedout() == 0


def test_status_is_ok_when_postgresql_is_available() -> None:
    response = client.get("/api/status")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_status_is_unavailable_when_postgresql_is_unavailable() -> None:
    app.dependency_overrides[is_database_available] = lambda: False

    response = client.get("/api/status")

    assert response.status_code == 503
    assert response.json() == {
        "status": "unavailable",
        "database": "unavailable",
    }
