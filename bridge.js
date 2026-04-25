// WhaleMind AI - Titanium 60 Internal Logic Bridge
const WhaleMindBot = {
    // 1. تفعيل المحرك وربط البيانات الحية
    activateEngine: async function() {
        console.log("🚀 جاري الاتصال بنظام Titanium 60...");
        
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            const statusEl = document.getElementById('system-status');
            const balanceEl = document.getElementById('total-balance');

            if(data.status === "ACTIVE") {
                statusEl.innerText = "🤖 الروبوت يعمل بالذكاء الاصطناعي (T60)";
                statusEl.style.color = "var(--green)";
                
                // تحديث الرصيد الحقيقي المسحوب من API باينانس الخاص بكِ
                if (data.live_balance !== undefined) {
                    balanceEl.innerText = `$${parseFloat(data.live_balance).toLocaleString()}`;
                }
                
                this.startMonitoring();
            }
        } catch (error) {
            console.error("❌ فشل الاتصال بالدماغ الرقمي:", error);
            document.getElementById('system-status').innerText = "⚠️ الدماغ غير متصل";
        }
    },

    // 2. جسر حفظ واختبار مفاتيح المستخدمين (CEX Bridge)
    saveUserKeys: async function() {
        const exchange = document.getElementById('exchange-select').value;
        const apiKey = document.getElementById('api-key-input').value;
        const secret = document.getElementById('api-secret-input').value;

        if (!apiKey || !secret) {
            alert("يرجى إدخال المفاتيح كاملة أولاً");
            return;
        }

        console.log(`📡 جاري اختبار الاتصال بمنصة ${exchange}...`);
        
        try {
            const res = await fetch('/api/verify-keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exchange, apiKey, secret })
            });
            const result = await res.json();

            if (result.status === "SUCCESS") {
                alert("✅ تم الربط بنجاح! الروبوت بدأ بمراقبة حسابك.");
            } else {
                alert("❌ فشل الربط: " + result.message);
            }
        } catch (e) {
            alert("⚠️ حدث خطأ في الخادم أثناء محاولة الربط");
        }
    },

    // 3. المراقبة الصامتة (التحليل المستمر)
    startMonitoring: function() {
        // الروبوت يطلب من التيتانيوم تحليل السوق كل 60 ثانية
        setInterval(async () => {
            try {
                await fetch('/api/trade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symbol: 'BTC/USDT' })
                });
                console.log("🧠 Titanium 60: تم تحديث التحليل الصامت للسوق.");
            } catch (e) {
                console.warn("فشل تحديث التحليل الدوري.");
            }
        }, 60000); 
    }
};

// تشغيل الجسر فور تحميل الصفحة
window.addEventListener('load', () => {
    WhaleMindBot.activateEngine();
});
