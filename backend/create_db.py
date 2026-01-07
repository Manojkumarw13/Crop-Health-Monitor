import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

try:
    # Connect to default 'postgres' db to create new db
    con = psycopg2.connect(user='postgres', password='postgres', host='localhost', port='5432')
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    cur.execute("CREATE DATABASE crop_monitor;")
    print("Database 'crop_monitor' created successfully!")
    con.close()
except Exception as e:
    print(f"Database creation failed (User might need to do it manually): {e}")
