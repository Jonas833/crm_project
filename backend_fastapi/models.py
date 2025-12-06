from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Literal, Optional

#class Konto(BaseModel):
   # email: EmailStr
   # username: str
    #role: Literal["user", "admin", "owner"]
    #created_at: Optional[datetime] = None

class CompanyAddress(BaseModel):
    street: str
    house_number: str
    zip: str
    city: str

class Company(BaseModel):
    name: str
    address_id: int
    email: str
    steuer_nr: str
    uid: str
    iban: str
    

class Customer(BaseModel):
    name: str
    email: str
    address_id: int = None
    created_at: Optional[datetime] = None

class Customer_Address (BaseModel):
    street: str
    house_number: str
    zip: str
    city: str
    tel: str


class Bill(BaseModel):
    customer_id: int
    total_value: float
    created_at: Optional[datetime] = None

class BillItem(BaseModel):
    bill_id: int
    description: str
    quantity: int
    price: float


class Termin(BaseModel):
    customer_id: int
    konto_id: int
    date_start: date
    date_end: date
    note: Optional[str] = None
    created_at: Optional[datetime] = None

