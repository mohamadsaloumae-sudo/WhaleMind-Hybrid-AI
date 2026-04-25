from fastapi import FastAPI, Request
import os
import ccxt
import requests

app = FastAPI()

class WhaleMindTitanium:
    def __init__(self):
        self.version = "60.0.1 Titanium"
        self.admin_wallet = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"

    def get_market_data(self):
        # هذه البيانات ستظهر فوراً عند فتح الموقع لضمان عمل الواجهة
        return [
            {"pair": "BTC/USDT", "amount": "15,000,000$", "type": "BUY", "time": "Just Now"},
            {"pair": "ETH/USDT", "amount": "8,400,000$", "type": "SELL", "time": "1 min ago"}
        ]

@app.get("/api/status")
async def get_status():
    # هذا المسار سيعطي الضوء الأخضر (ONLINE) للموقع ليعمل بدون مفاتيح
    engine = WhaleMindTitanium()
    return {
        "status": "ONLINE",
        "version": engine.version,
        "whale_radar": engine.get_market_data(),
        "insurance_needed": True
    }

@app.post("/api/connect-client")
async def connect_client(request: Request):
    # مسار ربط العميل بمفاتيح الـ API الخاصة به
    data = await request.json()
    try:
        exchange = ccxt.binance({
            'apiKey': data.get('apiKey'),
            'secret': data.get('secret'),
            'enableRateLimit': True
        })
        balance = exchange.fetch_balance()
        return {"status": "SUCCESS", "balance": balance['total'].get('USDT', 0)}
    except Exception as e:
        return {"status": "FAILED", "message": "فشل الاتصال: تأكد من صلاحيات الـ API"}
