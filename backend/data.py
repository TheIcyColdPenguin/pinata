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
    flag: str


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
            'question': maybe_level[4].split(',,'),
            'initialise_db': maybe_level[5],
            'flag': maybe_level[6],
            'checker': maybe_level[7],
        }

    return None


def run_query_in_memory(
    iniitalize_db: Optional[str] = None,
        query: str = '',
        checker: str = '',
        flag: str = ''
):
    new_conn = connect(':memory:')
    cur = new_conn.cursor()

    res = []
    column_names = []

    if iniitalize_db is not None:
        cur.executescript(iniitalize_db)
        new_conn.commit()
    if query:
        # loop through each command and run it individually
        print('query', query)
        lines = [
            line.strip()
            for line in
            query.split('--')[0].strip().split(';')
            if line.strip()
        ]
        print(lines)
        for i, line in enumerate(lines):
            # do not run if it's whitespace only
            new_cursor = cur.execute(line)
            if i == len(lines) - 1:
                print('ok')
                if new_cursor.description is None:
                    break
                column_names = [
                    row[0]
                    for row in new_cursor.description
                    if len(row) > 0
                ]
                res = new_cursor.fetchall()
                print('odd')
            else:
                new_cursor.fetchall()
        new_conn.commit()

    print('hmm', checker, res, column_names)
    if checker and not (len(res) and len(column_names)):
        print('hmm')
        new_cursor = cur.execute(checker)
        if len(new_cursor.fetchall()) == 0:
            return ([('name',)], [(flag, )])

    return (column_names, res)
