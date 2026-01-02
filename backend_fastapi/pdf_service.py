from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from pathlib import Path
from .database_connection import get_db_connection


def generate_bill_pdf(bill_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM bill WHERE id = %s", (bill_id,))
        bill = cursor.fetchone()

        cursor.execute(
            "SELECT * FROM bill_item WHERE bill_id = %s",
            (bill_id,)
        )
        items = cursor.fetchall()

        pdf_path = Path(f"pdf/bill_{bill_id}.pdf")
        pdf_path.parent.mkdir(exist_ok=True)

        c = canvas.Canvas(str(pdf_path), pagesize=A4)
        y = 800

        c.drawString(50, y, f"Rechnung #{bill_id}")
        y -= 40

        for item in items:
            line = f"{item['description']} | {item['quantity']} × {item['price']} €"
            c.drawString(50, y, line)
            y -= 20

        y -= 20
        c.drawString(50, y, f"Gesamt: {bill['total_value']} €")

        c.save()

        return str(pdf_path)
    finally:
        cursor.close()
        conn.close()