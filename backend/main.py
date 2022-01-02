from fastapi import FastAPI, status, Response
import sqlite3

from .data import initialize

db_connection = sqlite3.connect('level_data.db')
initialize(db_connection)  # create and hydrate database if not already done

app = FastAPI()


@app.get("/levels/{level_id}")
async def root(level_id: int, response: Response):
    try:
        maybe_level = db_connection.execute(
            'SELECT * FROM levels where id=(?)',
            (level_id,)
        ).fetchone()

        if maybe_level is not None:
            return {
                'id': maybe_level[0],
                'title': maybe_level[1],
                'description': maybe_level[2],
                'question': maybe_level[3].split(',')
            }
    except Exception as e:
        print(e)

    response.status_code = status.HTTP_404_NOT_FOUND
    return {}
