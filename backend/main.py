from fastapi import FastAPI, status, Response
import sqlite3

from pydantic import BaseModel

from itertools import zip_longest

from .data import get_level, initialise, run_query_in_memory


class Attempt(BaseModel):
    user_input: list[str]


db_connection = sqlite3.connect('level_data.db')
initialise(db_connection)  # create and hydrate database if not already done

app = FastAPI()


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

        run_query_in_memory(initialise_db, generated_query)
        
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR

    return {}
