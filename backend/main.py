from fastapi import FastAPI, Depends, HTTPException
from auth import create_access_token, get_password_hash, verify_password, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://cm-frontend-8d52.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fake_users_db = {
    "testuser": {
        "username": "testuser",
        "hashed_password": get_password_hash("testpass"),
    }
}

def load_excel_data():
    df = pd.read_excel("TestData.xlsx", engine="openpyxl")
    return df.to_dict(orient="records")

@app.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Falscher Benutzername oder Passwort")
    
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/data")
async def protected_route(current_user: str = Depends(get_current_user)):
    data = load_excel_data()
    return data