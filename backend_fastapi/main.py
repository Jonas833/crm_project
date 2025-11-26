from fastapi import FastAPI
from .schemas import SignupRequest, SigninRequest
from .models import CompanyAddress
from .database_fastapi import signup as signup_db , signin as signin_db
from .database_fastapi import create_company_address


app = FastAPI()

@app.post("/signup")
async def post_konto(konto_data: SignupRequest):
    result = signup_db(konto_data)
    return result

@app.post("/signin")
async def post_signin(data: SigninRequest):
    return signin_db(data)

@app.post("/CompanyAddress")
async def post_companyaddress(companyaddress_data:CompanyAddress):
    result = create_company_address(companyaddress_data)
    return result 