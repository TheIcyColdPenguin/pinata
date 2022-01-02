from fastapi import FastAPI
import sqlite3

from .data import initialize

db_connection = sqlite3.connect('level_data.db')
initialize(db_connection)  # create and hydrate database if not already done

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}
