from fastapi import FastAPI
import sqlite3

connection = sqlite3.connect(':memory:')

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
