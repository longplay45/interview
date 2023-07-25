import sqlite3
from config import config

SQL_GET_ALL = """SELECT
    g.glossary_id as id,
    c.title AS category,
    g.title AS title,
    g.content AS content
FROM
    glossary g
INNER JOIN category c
        USING(category_id)
ORDER BY title;"""

SQL_GET_ALL_BY_CAT = """SELECT
    g.glossary_id as id,
    c.title AS category,
    g.title AS title,
    g.content AS content
FROM
    glossary g
INNER JOIN category c
        USING(category_id)
WHERE g.category_id = (%s)
ORDER BY title;"""

SQL_GET_CATS = """SELECT
    c.title AS title
FROM
    category c
ORDER BY title;"""

SQL_GET_RANDOM = """SELECT
    g.glossary_id as id,
    c.title AS category,
    g.title AS title,
    g.content AS content
FROM
    glossary g
INNER JOIN category c
        USING(category_id)
ORDER BY RANDOM()
LIMIT 1;"""

def connect():
    params = config(section='sqlite3')
    con = sqlite3.connect(params['database'])
    # params = config(section='postgresql')
    # con = psycopg2.connect(**params)
    return con

def init():
    con = connect()
    with con as cursor:
        cursor.execute(open("schema.sql", "r").read())

def exe(stmt):
    con = connect()
    if isinstance(con, sqlite3.Connection):
        con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(stmt)
    rows = cur.fetchall()
    cur.close()
    con.close()
    return rows
