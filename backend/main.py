from fastapi import FastAPI
import mysql.connector as connector

database = connector.connect(
    host="localhost",
    user="admin",
    password=""  # NOSONAR
)

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
