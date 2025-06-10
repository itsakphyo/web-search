from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import ask_deep_search, ask_gemini
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str

@app.post("/search")
async def search(request: SearchRequest):
    try:
        query = request.query
        additional_information = ask_deep_search(query)
        result = ask_gemini(query, additional_information)
        
        # Try to parse the result as JSON
        try:
            parsed_result = json.loads(result)
        except json.JSONDecodeError:
            # If it's not valid JSON, return as text
            parsed_result = result
        
        return {
            "success": True,
            "query": query,
            "result": parsed_result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
