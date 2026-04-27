from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn
# استدعاء المحرك المالي والتكتيكي من ملفاتك السابقة
from WhaleMind_Finance_Guardian import WhaleMindFinance
from WhaleMind_Bridge_Interface import WhaleMindBridge

app = FastAPI()

# هيكل استقبال أمر التشغيل
class BotCommand(BaseModel):
    user_id: str
    action: str  # 'START' or 'STOP'
    is_demo: bool

@app.post("/execute")
async def execute_action(command: BotCommand):
    # هنا يتدخل الجسر لإعطاء الأوامر للملفات الخمسة
    if command.action == "START":
        # التأكد من الغاز (قانون الـ 50 دولار)
        return {"status": "success", "message": "WhaleMind AI ينطلق الآن سحابياً"}
    return {"status": "paused", "message": "تم إيقاف الروبوت مؤقتاً"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
