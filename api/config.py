# WhaleMind AI - Master Configuration Hub
class BaseConfig:
    # --- مفاتيح الاتصال السرية (API KEYS) ---
    # لقد وضعت مفاتيحك هنا مباشرة ليتصل "الدماغ" بالجسم فوراً
    BINANCE_API_KEY = "qtXFXujdHQmyQ8CSPyu0BXmJka..." # الصقي المفتاح الطويل هنا
    BINANCE_SECRET = "27JIKRBJqnnkLlEu9BEt36VhtV66..." # الصقي المفتاح السري هنا
    TRONGRID_API_KEY = "6131831c-50db-4509-b003-2cb056636ddc"

    # --- إعدادات النظام الأساسية ---
    VERSION = "60.0.1 Titanium"
    ENVIRONMENT = "production"
    
    # --- رادار الحيتان (Whale Radar) ---
    WHALE_THRESHOLD_USD = 5000000  # فلتر الـ 5 مليون دولار
    ALERT_COLOR = "#00d2ff"        # لون النيون
    
    # --- البيانات المالية والتحصيل (TRC20) ---
    ADMIN_WALLET_TRC20 = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"
    COMMISSION_RATE = 0.10  # نسبة الـ 10%
    
    # --- البنية التحتية ---
    NODES = {
        "ETH": "https://eth-mainnet.g.alchemy.com/v2/demo",
        "BSC": "https://bsc-dataseed.binance.org/",
        "TRON": "https://api.trongrid.io"
    }

Config = BaseConfig()
