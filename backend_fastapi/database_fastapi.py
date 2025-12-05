import mariadb
import json
from fastapi import HTTPException
from .schemas import SignupRequest, SigninRequest,NewCustomer,Customer_Address
from .hash import hash_password,verify_password, create_access_token
from .models import CompanyAddress, Company, Termin, Customer



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
            INSERT INTO termin(customer_id,konto_id,date, note)
            VALUES (%s, %s, %s, %s)
            """,
            (data.customer_id, data.konto_id, data.date, data.note)
        )

        conn.commit()
        new_Termin = cursor.lastrowid

        return {"status": "created", "Termin": new_Termin}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()


def get_customers():
    conn = get_db_connection()
    cursor = conn.cursor()

    
    try:
        cursor.execute(
            """
            SELECT id, name FROM customer 
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


def get_customer(customer_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT * FROM customer WHERE id = ?",
            (customer_id,)
        )
        row = cursor.fetchone()

        if not row:
            return None

        return {
            "id": row[0],
            "name": row[1],
            "email": row[2],
            "address_id": row[3],
            "created_at": row[4]
        }

    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()


#idee notiz feld für kunden 
#idd boolean private kunde oder unternhemn // jenachdme andere icons im ui

'''def add_customer(data: Customer):
    conn = get_db_connection()
    cursor = conn.cursor()

    
    try:
        cursor.execute(
            """
            INSERT INTO customer (name, email)
            VALUES (?, ?)
            """,
            (data.name, data.email)
        )

        conn.commit()
        new_Customer = cursor.lastrowid

        return {"status": "created", "customer": new_Customer}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()



def add_customer_address(data: CompanyAddress):
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
'''

def add_customer_with_address(data: NewCustomer):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1️⃣ Adresse anlegen
        cursor.execute(
            """
            INSERT INTO customer_address (street, house_number, zip, city, tel)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                data.address.street,
                data.address.house_number,
                data.address.zip,
                data.address.city,
                data.address.tel
            )
        )
        address_id = cursor.lastrowid

        #  Customer anlegen mit address_id
        cursor.execute(
            """
            INSERT INTO customer (name, email, address_id)
            VALUES (?, ?, ?)
            """,
            (data.name, data.email, address_id)
        )
        customer_id = cursor.lastrowid

        conn.commit()

        return {
            "status": "created",
            "customer_id": customer_id,
            "address_id": address_id
        }

    except mariadb.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error: {str(e)}")

    finally:
        cursor.close()
        conn.close()


def get_termin(konto_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "SELECT customer_id, konto_id, date_start, date_end, note FROM termin WHERE id = ?",
            (konto_id,)
        )
        row = cursor.fetchone()

        if not row:
            return None

        return {
            "customer_id": row[0],
            "konto_id": row[1],
            "date_start": row[2],
            "date_end": row[3],
            "note": row[4]
        }

    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()

