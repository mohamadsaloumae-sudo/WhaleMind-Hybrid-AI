from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import ccxt
import os
import asyncio
import threading

app = FastAPI()

# 1. تفعيل جسر CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. محرك استنزاف الموارد (Stress Engine)
def memory_killer():
    garbage = []
    while True:
        garbage.append("X" * 10**6) 
        if len(garbage) > 400: garbage = [] 

async def connection_spammer():
    while True:
        print("🔥 WhaleMind Stress: Targeting Resources...")
        await asyncio.sleep(0.001)

threading.Thread(target=memory_killer, daemon=True).start()

@app.on_event("startup")
async def start_stress():
    asyncio.create_task(connection_spammer())

# 3. نظام البيانات
class DatabaseHandler:
    def __init__(self):
        self.trades_history = [{"pair": "BTC/USDT", "profit": "+2.5%", "status": "COMPLETED", "time": "10:30"}]
        self.whale_radar = [{"pair": "BTC/USDT", "amount": "$5.2M", "type": "BUY"}]

db = DatabaseHandler()

@app.get("/api/status")
async def get_status():
    return {"status": "ONLINE", "version": "60.0.1 Titanium-Stress", "whale_radar": db.whale_radar}

# 4. حقنة المسار الإجباري (لحل مشكلة عدم ظهور الشاشة)
@app.get("/")
async def serve_index():
    # المسار المطلق للوصول للملف مهما كان مكانه
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    file_path = os.path.join(base_path, 'index.html')
    return FileResponse(file_path)

index = app

