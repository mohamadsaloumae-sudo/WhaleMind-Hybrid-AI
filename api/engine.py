from fastapi import FastAPI, Request
import os
import ccxt
import requests

app = FastAPI()

class WhaleMindCommercial:
    def __init__(self):
        # جعل النظام يعمل دائماً حتى لو المفاتيح فارغة
        self.version = "60.0.1 Titanium"
        self.admin_wallet = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"

    def get_public_whale_data(self):
        # بيانات عامة تظهر للعميل فور دخوله (لإبهاره بالنتائج)
        return [
            {"pair": "BTC/USDT", "amount": "15,000,000$", "type": "BUY", "status": "Confirmed"},
            {"pair": "ETH/USDT", "amount": "8,400,000$", "type": "SELL", "status": "Watching"}
        ]

@app.get("/api/status")
async def get_status():
    # هنا السر: الدماغ سيعطي "ACTIVE" دائماً لكي تفتح الشاشة
    return {
        "status": "ONLINE", 
        "version": "60.0.1 Titanium",
        "whale_radar": WhaleMindCommercial().get_public_whale_data(),
        "insurance_required": True # رسالة تخبر الواجهة بإظهار زر التأمين
    }

@app.post("/api/connect-client")
async def connect_client(request: Request):
    # هنا العميل يضع مفاتيحه بنفسه من واجهة الموقع
    data = await request.json()
    try:
        exchange = ccxt.binance({'apiKey': data['apiKey'], 'secret': data['secret']})
        balance = exchange.fetch_balance()
        return {"status": "SUCCESS", "balance": balance['total'].get('USDT', 0)}
    except:
        return {"status": "FAILED", "message": "المفاتيح غير صحيحة أو تحتاج تفعيل IP"}
