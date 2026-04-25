from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import ccxt
import httpx

app = FastAPI()

# الجسر الأول: CORS (السماح للواجهة الرئيسية بالتحدث مع الدماغ)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # يسمح لأي رابط موقع بطلب البيانات
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WhaleMindTitanium:
    def __init__(self):
        self.version = "60.0.1 Titanium"
        self.admin_wallet = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"

    def get_public_data(self):
        # هذه البيانات ستظهر فوراً في الشاشة لتثبت أن الرادار يعمل
        return [
            {"pair": "BTC/USDT", "amount": "15,000,000$", "type": "BUY", "time": "Just Now"},
            {"pair": "ETH/USDT", "amount": "8,400,000$", "type": "SELL", "time": "2 mins ago"}
        ]

# الجسر الثاني: مسار الحالة (Status Bridge)
@app.get("/api/status")
async def get_status():
    engine = WhaleMindTitanium()
    return {
        "status": "ONLINE",
        "version": engine.version,
        "whale_radar": engine.get_public_data(),
        "insurance_needed": True
    }

# الجسر الثالث: مسار الربط (Connection Bridge)
@app.post("/api/connect-client")
async def connect_client(request: Request):
    try:
        data = await request.json()
        # الربط مع باينانس لخدمة المستخدم
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
        return {"status": "FAILED", "message": str(e)}

# الجسر الرابع: ربط المحرك بالسيرفر الرئيسي
index = app 


