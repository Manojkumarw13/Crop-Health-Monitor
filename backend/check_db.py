from .database import engine, Base
from . import models
from sqlalchemy import inspect

print("Initializing DB...")
Base.metadata.create_all(bind=engine)

inspector = inspect(engine)
tables = inspector.get_table_names()
print(f"Tables found: {tables}")

if "users" in tables:
    print("SUCCESS: 'users' table exists.")
else:
    print("FAILURE: 'users' table missing.")
