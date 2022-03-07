from typing import List

from fastapi import FastAPI, status, Response
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

from pydantic import BaseModel

from itertools import zip_longest

from .data import get_level, initialise, run_query_in_memory


class Attempt(BaseModel):
    user_input: List[str]


db_connection = sqlite3.connect('level_data.db')
initialise(db_connection)  # create and hydrate database if not already done

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/levels/all')
async def levels_all(response: Response):
    try:
        level_names = db_connection.execute(
            'SELECT title FROM levels ORDER BY id;',
        ).fetchall()
        return [i for j in level_names for i in j]
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return {}


@app.get("/levels/{level_id}")
async def levels(level_id: int, response: Response):
    try:
        level_details = get_level(db_connection, level_id)
        if level_details is not None:
            return level_details

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return {}


@app.post('/attempt/{level_id}')
async def attempt(level_id: int, attempt_details: Attempt, response: Response):
    try:
        # get level details
        level_details = get_level(db_connection, level_id)

        if level_details is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {}

        # generate the query using user input
        # this is unsafe and should only be run on in-memory database connections
        level_query_template = level_details['question']
        initialise_db = level_details['initialise_db']
        generated_query = ''.join(
            i+j for i, j in
            zip_longest(level_query_template,
                        attempt_details.user_input, fillvalue='')
        )

        column_names, result = run_query_in_memory(
            initialise_db, generated_query
        )
        return {'query_result': result, 'column_names': column_names}

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return {}
