from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import ccxt
import os

app = FastAPI()

# 1. تفعيل جسر CORS العالمي
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. كود DatabaseHandler المحقون (الذاكرة المؤقتة)
class DatabaseHandler:
    def __init__(self):
        self.trades_history = [
            {"pair": "BTC/USDT", "profit": "+2.5%", "status": "COMPLETED", "time": "10:30"},
            {"pair": "ETH/USDT", "profit": "+1.8%", "status": "COMPLETED", "time": "11:15"}
        ]
        self.verified_projects = []
        # رادار الحيتان الافتراضي لبدء التشغيل
        self.whale_radar = [
            {"pair": "BTC/USDT", "amount": "$5.2M", "type": "BUY"},
            {"pair": "ETH/USDT", "amount": "$3.1M", "type": "SELL"}
        ]

    def save_trade(self, trade_data):
        self.trades_history.append(trade_data)
        print(f"✅ تم حفظ الصفقة في السجل الأساسي")

db = DatabaseHandler()

# 3. مسارات الـ API (الجسور)
@app.get("/api/status")
async def get_status():
    return {
        "status": "ONLINE",
        "version": "60.0.1 Titanium",
        "database": "READY",
        "history_count": len(db.trades_history),
        "whale_radar": db.whale_radar
    }

@app.get("/api/history")
async def get_history():
    return {
        "status": "SUCCESS",
        "trades": db.trades_history
    }

@app.post("/api/connect-client")
async def connect_client(request: Request):
    try:
        data = await request.json()
        exchange = ccxt.binance({
            'apiKey': data.get('apiKey', ''),
            'secret': data.get('secret', ''),
        })
        balance = exchange.fetch_balance()
        return {
            "status": "SUCCESS", 
            "balance": balance['total'].get('USDT', 0)
        }
    except Exception as e:
        return {"status": "FAILED", "message": str(e)}

# 4. --- الحقن الجوهري لفتح الواجهة (Frontend Bridge) ---
# هذا الجزء يضمن عدم ظهور صفحة 404 وتشغيل الشاشة السوداء فوراً
@app.get("/")
async def serve_index():
    return FileResponse('index.html')

# السطر الأخير لضمان رؤية السيرفر للتطبيق
index = app


