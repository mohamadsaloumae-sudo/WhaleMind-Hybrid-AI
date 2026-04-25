// WhaleMind AI - Titanium 60 Internal Logic Bridge & Financial Monitor
const WhaleMindBot = {
    // 1. تفعيل المحرك وربط البيانات الحية
    activateEngine: async function() {
        console.log("🚀 جاري الاتصال بنظام Titanium 60...");
        
        try {
            // الجسر يطلب الحالة من الدماغ
            const response = await fetch('/api/status');
            const data = await response.json();
            
            const statusEl = document.getElementById('system-status');
            const balanceEl = document.getElementById('total-balance');

            // تعديل: الدماغ يرسل "ONLINE" وليس "ACTIVE" حسب كود بايثون السابق
            if(data.status === "ONLINE") {
                statusEl.innerText = "🤖 الروبوت يعمل بالذكاء الاصطناعي (T60)";
                statusEl.style.color = "var(--green)";
                
                // عرض رصيد الحيتان المبدئي لفتح الشهية
                if (data.whale_radar) {
                    console.log("🐋 رادار الحيتان متصل ومستعد.");
                }
                
                this.startMonitoring();
            }
        } catch (error) {
            console.error("❌ فشل الاتصال بالدماغ الرقمي");
            const statusEl = document.getElementById('system-status');
            if(statusEl) {
                statusEl.innerText = "⚠️ الدماغ غير متصل (X)";
                statusEl.style.color = "var(--red)";
            }
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
            // الجسر يرسل البيانات للدماغ للتأكد منها عبر مكتبة ccxt
            const res = await fetch('/api/connect-client', { // تعديل المسار ليتوافق مع engine.py
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exchange, apiKey, secret })
            });
            const result = await res.json();

            if (result.status === "SUCCESS") {
                alert("✅ تم الربط بنجاح! الروبوت بدأ بمراقبة حسابك.");
                if(result.balance) {
                    document.getElementById('total-balance').innerText = `$${result.balance}`;
                }
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
                // إبقاء الاتصال حياً مع السيرفر
                await fetch('/api/status');
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
            alert("⚠️ لا توجد استجابة من محرك الدفع حالياً");
            btn.innerHTML = '<i class="fas fa-sync"></i> إعادة المحاولة';
        }
    }
};

// دالة نسخ عنوان المحفظة
function copyAddress() {
    const addr = document.getElementById('tron-addr').innerText;
    navigator.clipboard.writeText(addr).then(() => {
        alert("تم نسخ عنوان الإيداع: " + addr);
    });
}
