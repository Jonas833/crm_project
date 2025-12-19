from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import SignupRequest, SigninRequest
from .schemas import NewCustomer, Customer_Address
from .models import CompanyAddress, Company, Termin
from .database_fastapi import signup as signup_db , signin as signin_db
from .database_fastapi import create_company_address, create_company, create_termin, get_customers, get_customer
from .database_fastapi import add_customer_with_address, get_termin
from .crud.bill import post_bill, get_bill, post_bill_item, get_bill_item

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],
)

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


@app.get("/get_customers")
async def read_items():
    result = get_customers()

    if not result:
        raise HTTPException(status_code=404,detail =f"no customer found")
    
    return result 

@app.get("/customer/get{customer_id}")
async def read_customer(customer_id: int):
    result = get_customer(customer_id)

    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return result


#@app.post("/add_customer")
#async def post_customer(customer_data:Customer):
 #   result = add_customer(customer_data)
  #  return result 
#
#@app.post("/add_customer_address")
#async def post_customer_address(customer_address_data:Customer_Address):
 #   result = add_customer_address(customer_address_data)
  #  return result 

@app.post("/customer/post")
async def create_customer(data: NewCustomer):
    return add_customer_with_address(data)

#del customer 


@app.post("/Termin")
async def post_termin(termin_data:Termin):
    result = create_termin(termin_data)
    return result 


@app.get("/termin/get{konto_id}")
async def read_termin(konto_id: int):
    result = get_termin(konto_id)

    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return result

@app.get("/bill/get{customer_id}")
async def read_bill(customer_id: int):
    result= get_bill(customer_id)

    if not result:
        raise HTTPException(status_code=404, detail="bill not found")
    

@app.get("/bill_item/get{bill_id}")
async def read_bill_item(bill_id: int):
    result= get_bill_item(bill_id)

    if not result:
        raise HTTPException(status_code=404, detail="bill item not found")
    

@app.post("/bill/post")
async def bill_post():
    result= post_bill()

    if not result:
        raise HTTPException(status_code=404, detail="bill not created")
    


app.post("/bill_item/post")
async def bill_item_post():
    result= post_bill_item()

    if not result:
        raise HTTPException(status_code=404, detail="bill not created")