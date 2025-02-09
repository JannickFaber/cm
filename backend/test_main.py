# tests/test_main.py
from fastapi.testclient import TestClient
from main import app
from unittest.mock import patch
from auth import create_access_token

client = TestClient(app)

def generate_token():
    return create_access_token(data={"sub": "testuser"})

def test_login():
    response = client.post("/login", data={"username": "testuser", "password": "testpass"})
    
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"


def test_login_invalid_password():
    response = client.post("/login", data={"username": "testuser", "password": "wrongpass"})
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Falscher Benutzername oder Passwort"


@patch("main.load_excel_data", return_value=[{"column1": "value1"}, {"column1": "value2"}])
def test_protected_route(mock_load_excel_data):
    token = generate_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/data", headers=headers)
    
    assert response.status_code == 200
    assert len(response.json()) == 2
    assert response.json()[0]["column1"] == "value1"
    assert response.json()[1]["column1"] == "value2"
    mock_load_excel_data.assert_called_once()


def test_protected_route_no_auth():
    response = client.get("/data")
    
    assert response.status_code == 401
    assert "detail" in response.json()
    assert response.json()["detail"] == "Not authenticated"
