// WhaleMind AI - Titanium 60 Internal Logic Bridge & Financial Monitor
const WhaleMindBot = {
    // 1. تفعيل المحرك وربط البيانات الحية (باينانس + النظام)
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
                
                // عرض رصيدك الحقيقي المسحوب من باينانس (المفاتيح المخفية في Vercel)
                if (data.live_balance !== undefined) {
                    balanceEl.innerText = `$${parseFloat(data.live_balance).toLocaleString()}`;
                }
                
                this.startMonitoring();
            }
        } catch (error) {
            console.error("❌ فشل الاتصال بالدماغ الرقمي");
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
            alert("⚠️ حدث خطأ في الاتصال بالخادم");
        }
    },

    // 3. المراقبة الصامتة (تحليل التيتانيوم الدوري)
    startMonitoring: function() {
        setInterval(async () => {
            try {
                await fetch('/api/trade', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ symbol: 'BTC/USDT' })
                });
                console.log("🧠 Titanium 60: تم تحديث التحليل الصامت للسوق.");
            } catch (e) {}
        }, 60000); 
    }
};

// 4. محرك التحصيل المالي (Tron TRC20 Monitor)
const WhaleMindFinance = {
    verifyDeposit: async function() {
        const btn = document.getElementById('verify-btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الفحص...';
        
        try {
            // استدعاء الدالة التي تستخدم مفتاح TronGrid الخاص بكِ
            const res = await fetch('/api/verify-payment');
            const data = await res.json();
            
            if(data.status === "SUCCESS") {
                document.getElementById('gas-balance').style.color = "var(--green)";
                alert("🎉 تم تأكيد وصول USDT بنجاح! تم شحن وقود الروبوت.");
                location.reload(); 
            } else {
                alert("ℹ️ لم يتم رصد إيداع جديد بعد. تأكد من إرسال USDT (TRC20) وانتظر دقيقة.");
                btn.innerHTML = '<i class="fas fa-sync"></i> تحقق مرة أخرى';
            }
        } catch (e) {
            alert("⚠️ خطأ فني أثناء الفحص");
            btn.innerHTML = '<i class="fas fa-sync"></i> إعادة المحاولة';
        }
    }
};

// تشغيل الجسر فور تحميل الصفحة
window.addEventListener('load', () => {
    WhaleMindBot.activateEngine();
});

// دالة نسخ عنوان المحفظة للمستخدمين
function copyAddress() {
    const addr = document.getElementById('tron-addr').innerText;
    navigator.clipboard.writeText(addr).then(() => {
        alert("تم نسخ عنوان الإيداع: " + addr);
    });
}
