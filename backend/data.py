from pathlib import Path
from sqlite3 import Connection, IntegrityError, connect
from typing import List, Optional, TypedDict


class LevelDetails(TypedDict):
    id: int
    title: str
    description: str
    hint: str
    question: List[str]
    initialise_db: str


def initialise(conn: Connection):
    sql_file_path = Path(__file__).parent / 'initialise.sql'

    with sql_file_path.open() as f:
        setup = f.read()

    try:
        conn.executescript(setup)
        conn.commit()
    except IntegrityError:
        # happens when we try to reinsert the same data
        pass


def get_level(conn: Connection, level_id: int) -> Optional[LevelDetails]:
    maybe_level = conn.execute(
        'SELECT * FROM levels where id=(?)',
        (level_id,)
    ).fetchone()

    if maybe_level is not None:
        return {
            'id': maybe_level[0],
            'title': maybe_level[1],
            'description': maybe_level[2],
            'hint': maybe_level[3],
            'question': maybe_level[4].split(','),
            'initialise_db': maybe_level[5]
        }

    return None


def run_query_in_memory(iniitalize_db: Optional[str] = None, query: str = ''):
    new_conn = connect(':memory:')
    if iniitalize_db is not None:
        new_conn.executescript(iniitalize_db)
        new_conn.commit()
    if query:
        new_conn.executescript(query)
        new_conn.commit()
    print(new_conn.execute(
        'select name from sqlite_master where type=\'table\'').fetchall())
