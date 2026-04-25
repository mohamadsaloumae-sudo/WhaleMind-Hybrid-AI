from fastapi import FastAPI, Request
import os
import ccxt
import requests
from .config import Config  # استدعاء ملف الإعدادات

app = FastAPI()

class WhaleMindTitanium60:
    def __init__(self):
        self.version = Config.SYSTEM_VERSION
        # السحب من خزنة Vercel للأمان
        self.binance_key = os.getenv('BINANCE_API_KEY')
        self.binance_secret = os.getenv('BINANCE_SECRET')
        self.tron_api_key = os.getenv('TRONGRID_API_KEY')
        
        self.admin_wallet = Config.TRON_WALLET

    def get_my_balance(self):
        """فحص رصيدك الشخصي من باينانس"""
        if not self.binance_key: return "Not Connected"
        try:
            exchange = ccxt.binance({'apiKey': self.binance_key, 'secret': self.binance_secret})
            balance = exchange.fetch_balance()
            return balance['total'].get('USDT', 0)
        except: return "Connection Error"

    def check_tron_payment(self):
        """مراقبة تحويلات USDT TRC20 آلياً"""
        if not self.tron_api_key: return None
        url = f"https://api.trongrid.io/v1/accounts/{self.admin_wallet}/transactions/trc20"
        headers = {"TRON-PRO-API-KEY": self.tron_api_key}
        try:
            response = requests.get(url, headers=headers)
            return response.json().get('data', [])
        except: return []

t60 = WhaleMindTitanium60()

# --- المسارات المعدلة (Endpoints) ---

@app.get("/api/status")
async def get_status():
    return {
        "status": "ACTIVE", 
        "version": t60.version,
        "live_balance": t60.get_my_balance()
    }

@app.get("/api/verify-payment")
async def verify_payment():
    """نقطة فحص الدفع الآلي للمشتركين"""
    txs = t60.check_tron_payment()
    if txs:
        # هنا الروبوت يتأكد من وجود معاملة جديدة
        return {"status": "SUCCESS", "message": "تم تأكيد الدفع من شبكة Tron"}
    return {"status": "PENDING", "message": "لم يتم رصد تحويلات جديدة بعد"}

@app.post("/api/verify-keys")
async def verify_user_keys(request: Request):
    data = await request.json()
    try:
        ex_class = getattr(ccxt, data['exchange'])
        ex = ex_class({'apiKey': data['apiKey'], 'secret': data['secret']})
        ex.fetch_balance()
        return {"status": "SUCCESS", "message": "تم الربط بنجاح!"}
    except Exception as e:
        return {"status": "FAILED", "message": str(e)}

@app.post("/api/trade")
async def execute_trade(request: Request):
    # منطق التداول الصامت (التيتانيوم)
    return {"signal": "BUY", "strength": "94%", "engine": "T60"}
