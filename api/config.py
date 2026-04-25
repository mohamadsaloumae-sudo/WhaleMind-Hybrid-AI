# WhaleMind AI - Master Configuration Hub
class BaseConfig:
    # --- إعدادات النظام الأساسية ---
    VERSION = "60.0.1 Titanium"
    ENVIRONMENT = "production"
    
    # --- رادار الحيتان (Whale Radar) ---
    WHALE_THRESHOLD_USD = 5000000  # فلتر الـ 5 مليون دولار (لا يتم رصد ما هو أقل)
    ALERT_COLOR = "#00d2ff"        // لون النيون الخاص بالتنبيهات
    
    # --- البيانات المالية والتحصيل (TRC20) ---
    # هذا العنوان هو الذي سيظهر للمستخدمين لإرسال الـ 10%
    ADMIN_WALLET_TRC20 = "TRSKhB9Fvvw6SM8QpK2vep4XqN6gyXDQ9V"
    COMMISSION_RATE = 0.10  # نسبة الـ 10% من الأرباح
    
    # --- الشبكات المدعومة ---
    SUPPORTED_NETWORKS = ["TRC20", "ERC20", "BEP20", "SOLANA"]
    
    # --- البنية التحتية اللامركزية (RPC Nodes) ---
    # روابط السيرفرات للربط اللامركزي مستقبلاً (Alchemy & Public Nodes)
    NODES = {
        "ETH": "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
        "BSC": "https://bsc-dataseed.binance.org/",
        "TRON": "https://api.trongrid.io"
    }

# حقن إضافي لسهولة الاستدعاء في engine.py
Config = BaseConfig()

