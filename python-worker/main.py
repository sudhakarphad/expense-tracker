from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import io
import os
import json
from PIL import Image
import easyocr
import asyncio
import httpx
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Expense Processor", version="1.0.0")

reader = None

class ReceiptRequest(BaseModel):
    image: str
    filename: str = "receipt.jpg"

class ExpenseResponse(BaseModel):
    amount: float
    category: str
    vendor: str = ""
    description: str = ""

def get_ocr_reader():
    global reader
    if reader is None:
        logger.info("Initializing EasyOCR reader...")
        reader = easyocr.Reader(['en'], gpu=False)
    return reader

async def call_groq_api(ocr_text: str) -> dict:
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        logger.warning("GROQ_API_KEY not set, using rule-based parsing")
        return parse_expense_rule_based(ocr_text)

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "mixtral-8x7b-32768",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"""Parse this receipt text and extract expense information. 
Respond with ONLY valid JSON:
{{"amount": <number>, "category": <string>, "vendor": <string>, "description": <string>}}

Categories: Food, Transport, Shopping, Entertainment, Utilities, Other

Receipt text:
{ocr_text}"""
                        }
                    ],
                    "temperature": 0.3,
                    "max_tokens": 200,
                },
                timeout=10.0
            )
            
            result = response.json()
            content = result['choices'][0]['message']['content'].strip()
            
            parsed = json.loads(content)
            return {
                "amount": float(parsed.get("amount", 0)),
                "category": parsed.get("category", "Other"),
                "vendor": parsed.get("vendor", ""),
                "description": parsed.get("description", ""),
            }
    except Exception as e:
        logger.error(f"Groq API error: {e}")
        return parse_expense_rule_based(ocr_text)

def parse_expense_rule_based(text: str) -> dict:
    text_lower = text.lower()
    
    import re
    amounts = re.findall(r'(?:price|total|amount|cost)[\s:$]*(\d+\.?\d*)', text_lower)
    amount = float(amounts[0]) if amounts else 0.0
    
    category = "Other"
    if any(word in text_lower for word in ['restaurant', 'cafe', 'food', 'pizza', 'burger', 'lunch', 'dinner', 'breakfast']):
        category = "Food"
    elif any(word in text_lower for word in ['uber', 'taxi', 'gas', 'fuel', 'metro', 'bus', 'train']):
        category = "Transport"
    elif any(word in text_lower for word in ['store', 'shop', 'mall', 'clothes', 'shoe']):
        category = "Shopping"
    elif any(word in text_lower for word in ['cinema', 'movie', 'theater', 'game', 'sport']):
        category = "Entertainment"
    elif any(word in text_lower for word in ['electric', 'water', 'gas', 'internet', 'phone']):
        category = "Utilities"
    
    vendor = ""
    words = text.split()
    if len(words) > 0:
        vendor = words[0]
    
    return {
        "amount": amount,
        "category": category,
        "vendor": vendor,
        "description": f"Auto-detected from receipt: {text[:200]}",
    }

@app.post("/process-receipt", response_model=ExpenseResponse)
async def process_receipt(request: ReceiptRequest):
    try:
        image_data = base64.b64decode(request.image)
        image = Image.open(io.BytesIO(image_data))
        
        logger.info(f"Processing image: {request.filename}")
        
        reader = get_ocr_reader()
        results = reader.readtext(image, detail=0)
        ocr_text = "\n".join(results) if results else ""
        
        if not ocr_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from image")
        
        logger.info(f"OCR extracted: {len(ocr_text)} characters")
        
        expense = await call_groq_api(ocr_text)
        
        return ExpenseResponse(**expense)
        
    except Exception as e:
        logger.error(f"Error processing receipt: {e}")
        raise HTTPException(status_code=400, detail=f"Error processing receipt: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
