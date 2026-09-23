from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)
TEST_USERNAME = "beta-test-user"
TEST_PASSWORD = "beta-test-only"


@pytest.fixture(autouse=True)
def configured_beta_credentials(monkeypatch):
    monkeypatch.setenv("BETA_USERNAME", TEST_USERNAME)
    monkeypatch.setenv("BETA_PASSWORD", TEST_PASSWORD)

def test_login_success():
    response = client.post(
        "/api/auth/login",
        json={"username": TEST_USERNAME, "password": TEST_PASSWORD}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure():
    response = client.post(
        "/api/auth/login",
        json={"username": "wrong", "password": TEST_PASSWORD}
    )
    assert response.status_code == 401

    old_default_response = client.post(
        "/api/auth/login",
        json={"username": "userbeta", "password": "userbeta"},
    )
    assert old_default_response.status_code == 401

    non_ascii_response = client.post(
        "/api/auth/login",
        json={"username": "usuário", "password": TEST_PASSWORD},
    )
    assert non_ascii_response.status_code == 401


@pytest.mark.parametrize("missing_name", ["BETA_USERNAME", "BETA_PASSWORD"])
def test_login_unavailable_without_configured_credentials(monkeypatch, missing_name):
    monkeypatch.delenv(missing_name)
    response = client.post(
        "/api/auth/login",
        json={"username": TEST_USERNAME, "password": TEST_PASSWORD},
    )
    assert response.status_code == 503

def test_logout():
    # Login first
    login_resp = client.post(
        "/api/auth/login",
        json={"username": TEST_USERNAME, "password": TEST_PASSWORD}
    )
    token = login_resp.json()["access_token"]
    
    # Logout
    response = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Logged out successfully"}
    
    # Try logout again
    response_again = client.post(
        "/api/auth/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response_again.status_code == 401

    dashboard_response = client.get(
        "/api/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert dashboard_response.status_code == 401
