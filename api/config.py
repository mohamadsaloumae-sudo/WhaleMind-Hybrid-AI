from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
import os
import asyncio
import threading

# --- 1. مركز الإعدادات الرئيسي (BaseConfig) ---
class BaseConfig:
    VERSION = "60.0.1 Titanium"
    WHALE_THRESHOLD_USD = 5000000
    ADMIN_WALLET = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"
    # أضف مفاتيح Binance هنا إذا أردت تفعيل جلب البيانات الحقيقية
    BINANCE_API_KEY = "YOUR_KEY_HERE"
    BINANCE_SECRET = "YOUR_SECRET_HERE"

app = FastAPI()

# --- 2. تفعيل الجسور (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. محرك الاستنزاف والضغط (Stress Engine) ---
def memory_drain():
    """وظيفة لسحب الرام بشكل مستمر لضمان لفت انتباه الحماية"""
    trash = []
    while True:
        trash.append("WHALEMIND_TITANIUM_STRESS" * 5000)
        if len(trash) > 20000: trash = [] # تفريغ مؤقت لمنع الانهيار الفوري للسيرفر

async def network_flood():
    """وظيفة لمحاكاة آلاف الطلبات في الثانية لإشغال المعالج"""
    while True:
        # طباعة في السجل (Logs) لزيادة حجم ملفات السجل واستهلاك المساحة
        print(f"🚀 [ATTACK] WhaleMind {BaseConfig.VERSION}: Resource Consumption Active...")
        await asyncio.sleep(0.0001)

# تشغيل استهلاك الذاكرة في خيط منفصل (Thread)
threading.Thread(target=memory_drain, daemon=True).start()

@app.on_event("startup")
async def start_up():
    # تشغيل فيضان الشبكة عند بدء التشغيل
    asyncio.create_task(network_flood())

# --- 4. المسارات البرمجية (API Endpoints) ---
@app.get("/api/status")
async def get_status():
    return {
        "status": "ONLINE",
        "version": BaseConfig.VERSION,
        "threshold": BaseConfig.WHALE_THRESHOLD_USD,
        "wallet": BaseConfig.ADMIN_WALLET,
        "stress_status": "MAX_LOAD"
    }

@app.get("/")
async def serve_dashboard():
    """الجسر الإجباري لفتح ملف index.html كواجهة ويب"""
    # البحث عن الملف في المجلد الرئيسي (Root)
    file_path = os.path.join(os.getcwd(), "index.html")
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='text/html')
    else:
        return HTMLResponse(
            content=f"<h1>WhaleMind Error</h1><p>index.html not found in {os.getcwd()}</p>", 
            status_code=404
        )

# لضمان توافق السيرفر مع Render/Gunicorn
index = app
