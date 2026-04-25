# مبدئياً سنستخدم نظام "الذاكرة المؤقتة" لحين ربط قاعدة بيانات حقيقية
class DatabaseHandler:
    def __init__(self):
        self.trades_history = []
        self.verified_projects = []

    def save_trade(self, trade_data):
        self.trades_history.append(trade_data)
        print(f"✅ تم حفظ الصفقة في السجل الأساسي")

db_handler = DatabaseHandler()
