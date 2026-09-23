from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_dashboard_summary_unauthenticated():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 401

def test_dashboard_summary_authenticated(monkeypatch):
    monkeypatch.setenv("BETA_USERNAME", "beta-test-user")
    monkeypatch.setenv("BETA_PASSWORD", "beta-test-only")
    # Login to get token
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "beta-test-user", "password": "beta-test-only"}
    )
    token = login_resp.json()["access_token"]
    
    # Get dashboard summary
    response = client.get(
        "/api/dashboard/summary",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "beaches" in data
    assert "tides" in data
    assert "quiver" in data
    assert "alerts" in data
