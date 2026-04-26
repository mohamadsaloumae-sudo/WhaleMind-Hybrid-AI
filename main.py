from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import ccxt
from cryptography.fernet import Fernet

app = FastAPI()

# تفعيل CORS للسماح بالاتصالات الخارجية (Flask-Cors equivalent in FastAPI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def read_root():
    # هذا الأمر يقوم بقراءة ملف الواجهة index.html وتشغيله
    with open("index.html", "r", encoding="utf-8") as f:
        return f.read()

@app.get("/api/status")
async def get_status():
    # محاكاة لبيانات الحيتان التي ستسحبها مكتبة CCXT لاحقاً
    return {
        "whale_radar": [
            {"pair": "BTC/USDT", "amount": "$22.5M", "type": "BUY"},
            {"pair": "ETH/USDT", "amount": "$12.1M", "type": "SELL"}
        ]
    }

if __name__ == "__main__":
    # تشغيل السيرفر على المنفذ الذي يحدده Render تلقائياً
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
