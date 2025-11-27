import mariadb
import json
from fastapi import HTTPException
from .schemas import SignupRequest, SigninRequest
from .hash import hash_password,verify_password, create_access_token
from .models import CompanyAddress, Company, Termin



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



def signup(data: SignupRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        #Email prüfen
        cursor.execute("SELECT id FROM konto WHERE email = ?", (data.email,))
        if cursor.fetchone() is not None:
            raise HTTPException(status_code=400, detail="Email already registered")

        #Username prüfen
        cursor.execute("SELECT id FROM konto WHERE username = ?", (data.username,))
        if cursor.fetchone() is not None:
            raise HTTPException(status_code=400, detail="Username already taken")

        #Passwort hashen
        hashed_pw = hash_password(data.password)

        #user einfügen
        cursor.execute(
            """
            INSERT INTO konto (email, username, password, role)
            VALUES (?, ?, ?, ?)
            """,
            (data.email, data.username, hashed_pw, "user")
        )

        conn.commit()
        new_id = cursor.lastrowid

        return {"status": "created", "user_id": new_id}

    except mariadb.Error as e:
        conn.rollback()
        # Logging wäre sauberer, aber fürs Projekt reicht:
        raise HTTPException(status_code=500, detail="Database insert error")

    finally:
        cursor.close()
        conn.close()

def signin(data: SigninRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Benutzer abrufen
        cursor.execute(
            "SELECT id, username, password FROM konto WHERE username = ?",
            (data.username,)
        )
        row = cursor.fetchone()

        if row is None:
            raise HTTPException(status_code=401, detail="Invalid login")

        user_id, username, hashed_pw = row

        # 2. Passwort prüfen
        if not verify_password(data.password, hashed_pw):
            raise HTTPException(status_code=401, detail="Invalid login")

        # 3. JWT erzeugen
        token = create_access_token(username=username)

        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user_id,
            "username": username
        }

    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()

def create_company_address(data: CompanyAddress):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO company_address (street, house_number, zip, city)
            VALUES (?, ?, ?, ?)
            """,
            (data.street, data.house_number, data.zip,data.city)
        )

        conn.commit()
        new_CompanyAddress = cursor.lastrowid

        return {"status": "created", "CompanyAdress": new_CompanyAddress}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()

def create_company(data: Company):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO company(street, house_number, zip, city)
            VALUES (?, ?, ?, ?)
            """,
            (data.street, data.house_number, data.zip,data.city)
        )

        conn.commit()
        new_CompanyAddress = cursor.lastrowid

        return {"status": "created", "CompanyAdress": new_CompanyAddress}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()

def create_termin(data: Termin):
    conn = get_db_connection()
    cursor = conn.cursor()


    try:
        cursor.execute(
            """
            INSERT INTO termin(customer_id, date, note)
            VALUES (?, ?, ?)
            """,
            (data.customer_id, data.date, data.note)
        )

        conn.commit()
        new_Termin = cursor.lastrowid

        return {"status": "created", "Termin": new_Termin}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()


def get_customer():
    conn = get_db_connection()
    cursor = conn.cursor()


    try:
        cursor.execute(
            """
            SELECT name FROM customer 
            WHERE name IS NOT NULL 
            ORDER BY name
            """,
        )
        rows = cursor.fetchall()

        return [
            {"id": row[0], "name": row[1]}
            for row in rows
        ]
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()
