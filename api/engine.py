from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ccxt
import httpx

app = FastAPI()

# تفعيل الربط بين الواجهة والدماغ (CORS) لضمان عدم ظهور أخطاء في المتصفح
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class WhaleMindTitanium:
    def __init__(self):
        self.version = "60.0.1 Titanium"
        self.admin_wallet = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"

    def get_public_data(self):
        # هذه هي البيانات التي ستعرضها الشاشة فوراً عند الفتح
        return [
            {"pair": "BTC/USDT", "amount": "15,000,000$", "type": "BUY", "time": "Just Now"},
            {"pair": "ETH/USDT", "amount": "8,400,000$", "type": "SELL", "time": "2 mins ago"}
        ]

@app.get("/api/status")
async def get_status():
    # هذا المسار هو الذي سيحول علامة الـ X إلى علامة صح خضراء ✔️
    engine = WhaleMindTitanium()
    return {
        "status": "ONLINE",
        "version": engine.version,
        "whale_radar": engine.get_public_data(),
        "insurance_needed": True
    }

@app.post("/api/connect-client")
async def connect_client(request: Request):
    # استخدام مكتبة ccxt التي أضفتها أنت للربط مع العميل
    try:
        data = await request.json()
        exchange = ccxt.binance({
            'apiKey': data.get('apiKey'),
            'secret': data.get('secret'),
        })
        balance = exchange.fetch_balance()
        return {
            "status": "SUCCESS",
            "balance": balance['total'].get('USDT', 0)
        }
    except Exception as e:
        return {"status": "FAILED", "message": "فشل الاتصال بباينانس"}

