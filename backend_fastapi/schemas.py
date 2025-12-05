from pydantic import BaseModel, EmailStr, Field

class SignupRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=6)

class SigninRequest(BaseModel):
    username: str
    password: str


class Customer_Address (BaseModel):
    street: str
    house_number: str
    zip: str
    city: str
    tel: str

class NewCustomer(BaseModel):
    name: str
    email: str
    address: Customer_Address
