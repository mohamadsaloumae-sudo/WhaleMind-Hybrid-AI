// WhaleMind Logic Engine - Unified Bridge
// تم حقن الرابط المباشر لسيرفر ريل واي
const API_URL = "https://Worker-production-179b.up.railway.app"; 

async function startBot() {
    const statusElement = document.getElementById('status');
    statusElement.innerText = "جاري إرسال أمر التشغيل للسحاب...";

    try {
        // الاتصال المباشر مع ملف WhaleMind_API_Gateway في ريل واي
        const response = await fetch(`${API_URL}/execute`, {
            method: 'POST',
            mode: 'cors', // تفعيل العبور البرمجي
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: "User_Mobile_Samsung", // المعرف الخاص بك
                action: "START",
                is_demo: true
            })
        });

        const data = await response.json();
        if (data.status === "success" || data.status === "active") {
            statusElement.innerText = "WhaleMind يعمل الآن سحابياً.. النبض مستقر ✅";
            statusElement.style.color = "#27ae60";
        }
    } catch (error) {
        // في حال وجود مشكلة في الربط أو الـ CORS
        console.error("Connection Error:", error);
        statusElement.innerText = "فشل الاتصال بالسيرفر.. تأكد من تفعيل المنظومة في Railway.";
        statusElement.style.color = "#e74c3c";
    }
}

// وظيفة تحديث النبض والغاز تلقائياً كل دقيقة (Heartbeat)
setInterval(async () => {
    try {
        console.log("يتم الآن تحديث حالة النبض من WhaleMind...");
        // سيقوم الروبوت بتحديث الحالة في قاعدة بيانات Neon وعرضها هنا
    } catch (e) {
        console.log("بانتظار استجابة السيرفر...");
    }
}, 60000);
