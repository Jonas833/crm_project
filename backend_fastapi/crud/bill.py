import mariadb
import json
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from ..models import Bill, BillItem, BillCreateRequest
from ..database_connection import get_db_connection

def get_templates():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    try:
        cur.execute("""
          SELECT id, description, price, default_quantity
          FROM bill_item_template
          ORDER BY price
        """)
        return cur.fetchall()
    finally:
        cur.close()
        conn.close()

def create_bill_from_items(data: BillCreateRequest):
    conn = get_db_connection()
    conn.autocommit = False
    cursor = conn.cursor(dictionary=True)

    try:
        if not data.item_ids:
            raise HTTPException(400, "item_ids must not be empty")

        # 1) Items laden
        placeholders = ",".join(["%s"] * len(data.item_ids))
        cursor.execute(
            f"""
            SELECT id, description, price, default_quantity
            FROM bill_item_template
            WHERE id IN ({placeholders})
            """,
            tuple(data.item_ids)
        )
        items = cursor.fetchall()

        if len(items) != len(set(data.item_ids)):
            raise HTTPException(400, "Invalid item selection")

        # 2) Total berechnen
        total_value = sum(
            item["price"] * item["default_quantity"] for item in items
        )

        # 3) Bill erstellen
        cursor.execute(
            """
            INSERT INTO bill (customer_id, total_value)
            VALUES (%s, %s)
            """,
            (data.customer_id, total_value)
        )
        bill_id = cursor.lastrowid

        # 4) Items kopieren
        for item in items:
            cursor.execute(
                """
                INSERT INTO bill_item (bill_id, description, quantity, price)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    bill_id,
                    item["description"],
                    item["default_quantity"],  # ✅ hier!
                    item["price"]
                )
            )

        conn.commit()
        return bill_id

    except mariadb.Error as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()







def post_bill(data: Bill):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO bill(customer_id)
            VALUES (?, ?)
            """,
            (data.customer_id,data)
        )

        conn.commit()
        new_Bill = cursor.lastrowid

        return {"status": "created", "Bill": new_Bill}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()



def get_bill(customer_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT id, customer_id, total_value, created_at 
            FROM bill 
            WHERE customer_id = %s
            """,
            (customer_id,) 
        )

        rows = cursor.fetchall()

        return [
            {"id": row[0], 
             "customer_id": row[1],
             "total_value": row [2],
             "created_at": row[3]
            }
            for row in rows
        ]
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()



#admin funktion
def post_bill_item(data: BillItem):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO bill_item(bill_id,description,quantity,price)
            VALUES (?, ?, ?, ?)
            """,
            (data.bill_id,data.description,data.quantity,data.price)
        )

        conn.commit()
        new_Bill_item = cursor.lastrowid

        return {"status": "created", "id": new_Bill_item}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()




def get_bill_item(bill_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT id, bill_id, description, price, quantity
            FROM bill_item
            WHERE bill_id = %s
            """,
            (bill_id,) 
        )

        rows = cursor.fetchall()

        
        return [
            {"id": row[0], 
             "bill_id": row[1],
             "description": row [2],
             "price": row[3],
             "quantity": row [4]
             
             
             }
            for row in rows
        ]
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()


