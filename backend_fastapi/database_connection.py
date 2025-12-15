import mariadb
import json 
from fastapi import HTTPException

def load_db_config(path="db_config.json"):
    with open(path, "r") as f:
        return json.load(f)
    
config = load_db_config(path="backend_fastapi/db_config.json")

#build db connection 
def get_db_connection():
    try:
        conn= mariadb.connect(**config)
        return conn
    except mariadb.Error as e:
        print(f"ERROR connecting to Mariadb: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")