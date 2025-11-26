from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Literal, Optional

class Konto(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: Literal["user", "admin", "owner"]
    created_at: Optional[datetime] = None

class CompanyAddress(BaseModel):
    street: str
    house_number: str
    zip: str
    city: str

class Company(BaseModel):
    id: int
    name: str
    address_id: int
    owner_id: int

class Customer(BaseModel):
    id: int
    company_id: int
    first_name: str
    last_name: str
    email: str
    address_id: int
    created_at: Optional[datetime] = None

class Bill(BaseModel):
    id: int
    customer_id: int
    total_value: float
    created_at: Optional[datetime] = None

class BillItem(BaseModel):
    id: int
    bill_id: int
    description: str
    quantity: int
    price: float

class Termin(BaseModel):
    id: int
    customer_id: int
    date: datetime
    note: str
    created_at: Optional[datetime] = None


