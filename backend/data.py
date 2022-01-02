from pathlib import Path
from sqlite3 import Connection, IntegrityError


def initialize(conn: Connection):
    sql_file_path = Path(__file__).parent / 'initialise.sql'

    with sql_file_path.open() as f:
        setup = f.read()

    try:
        conn.executescript(setup)
        conn.commit()
    except IntegrityError:
        # happens when we try to reinsert the same data
        pass
