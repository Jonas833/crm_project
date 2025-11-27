from fastapi import FastAPI, HTTPException
from .schemas import SignupRequest, SigninRequest
from .models import CompanyAddress, Company, Termin
from .database_fastapi import signup as signup_db , signin as signin_db
from .database_fastapi import create_company_address, create_company, create_termin, get_customer


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

@app.post("/Company")
async def post_company(company_data:Company):
    result = create_company(company_data)
    return result 

@app.post("/Termin")
async def post_termin(termin_data:Termin):
    result = create_termin(termin_data)
    return result 

@app.get("/get_customer")
async def read_items():
    result = get_customer()

    if not result:
        raise HTTPException(status_code=404,detail =f"no customer found")
    
    return result 