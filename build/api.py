# api.py

import database as db

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from starlette.responses import PlainTextResponse 
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(docs_url=None, redoc_url=None)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # Set the appropriate origins or use ["http://localhost:3000"] for specific origins
    allow_origins=["*"],  
    allow_headers=["*"],
    allow_credentials=True,
    allow_methods=["GET"],
    # allow_methods=["GET", "POST", "PUT", "DELETE"],
)

# Configure api endpoints
@app.get('/api', response_class=PlainTextResponse)
async def search():
    return PlainTextResponse('Hi')

@app.get("/api/cats")
async def get_all_cats():
    json_compatible_data = jsonable_encoder(db.exe(db.SQL_GET_CATS))
    return JSONResponse(content=json_compatible_data)

@app.get("/api/entries")
async def get_all_entries():
    json_compatible_data = jsonable_encoder(db.exe(db.SQL_GET_ALL))
    return JSONResponse(content=json_compatible_data)

