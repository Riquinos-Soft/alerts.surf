from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_login_success():
    response = client.post(
        "/api/auth/login",
        json={"username": "userbeta", "password": "userbeta"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_failure():
    response = client.post(
        "/api/auth/login",
        json={"username": "wrong", "password": "userbeta"}
    )
    assert response.status_code == 401

def test_logout():
    # Login first
    login_resp = client.post(
        "/api/auth/login",
        json={"username": "userbeta", "password": "userbeta"}
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
