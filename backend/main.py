from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import models, database
import auth, templates, weddings, guests, uploads

import os
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Mielove API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mielove.vercel.app", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(templates.router)
app.include_router(weddings.router)
app.include_router(guests.router)
app.include_router(uploads.router)

@app.get("/")
def read_root():
    return {"message": "Mielove Backend is running!"}
