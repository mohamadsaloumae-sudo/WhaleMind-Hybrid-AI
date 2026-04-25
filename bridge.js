// WhaleMind AI - Internal Logic Bridge
const WhaleMindBot = {
    // تشغيل الروبوت وربطه بدماغ التيتانيوم
    activateEngine: async function() {
        console.log("🤖 تفعيل نظام Titanium 60...");
        
        try {
            const response = await fetch('/api/status');
            const data = await response.json();
            
            if(data.status === "ACTIVE") {
                document.getElementById('system-status').innerText = "🤖 الروبوت يعمل بالذكاء الاصطناعي";
                document.getElementById('system-status').style.color = "var(--green)";
                this.startMonitoring();
            }
        } catch (error) {
            console.error("خطأ في الاتصال بالدماغ");
        }
    },

    startMonitoring: function() {
        // هنا يبدأ الروبوت بسحب البيانات وتحليلها بصمت
        setInterval(async () => {
            // طلب تحليل من التيتانيوم دون كشف التفاصيل للمستخدم
            await fetch('/api/trade', {
                method: 'POST',
                body: JSON.stringify({ symbol: 'BTC/USDT' })
            });
        }, 60000); // تحديث كل دقيقة
    }
};

// تشغيل الجسر فور التحميل
window.addEventListener('load', () => {
    WhaleMindBot.activateEngine();
});
