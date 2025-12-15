import mariadb
import json
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from models import Bill, BillItem
from database_connection import get_db_connection


def post_Bill(data: Bill):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO bill(customer_id,total_value)
            VALUES (?, ?)
            """,
            (data.customer_id,data.total_value)
        )

        conn.commit()
        new_Bill = cursor.lastrowid

        return {"status": "created", "": new_Bill}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()



def get_Bill(data: Bill):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            select * from  bill where customer_id = ?
            VALUES (?)
            """,
            (data.customer_id,data.total_value)
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
def post_Bill_Item(data: BillItem):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO bil_item(bill_id,description,quantity,price)
            VALUES (?, ?, ?, ?)
            """,
            (data.bill_id,data.description,data.quantity,data.price)
        )

        conn.commit()
        new_Bill_item = cursor.lastrowid

        return {"status": "created", "": new_Bill_item}
    
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()




def get_Bill_item(data: BillItem):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            select * from  bill where bill_id = ?
            VALUES (?)
            """,
            (data.customer_id,data.total_value)
        )

        rows = cursor.fetchall()

        return [
            {"id": row[0], 
             "bill_id": row[1],
             "quantiy": row [2],
             "price": row[3],
             "description": row [4]
             
             
             }
            for row in rows
        ]
    except mariadb.Error:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        cursor.close()
        conn.close()


