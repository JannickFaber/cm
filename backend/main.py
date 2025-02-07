from fastapi import FastAPI, Depends, HTTPException
from auth import create_access_token, get_password_hash, verify_password, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

app = FastAPI()

# Fake-Datenbank (in einer echten Anwendung sollte hier eine DB verwendet werden)
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": get_password_hash("testpass"),
    }
}

@app.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login-Endpoint, gibt ein JWT-Token zurück."""
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Falscher Benutzername oder Passwort")
    
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    """Ein geschützter Bereich, nur zugänglich mit gültigem Token."""
    return {"message": f"Willkommen, {current_user['username']}!"}