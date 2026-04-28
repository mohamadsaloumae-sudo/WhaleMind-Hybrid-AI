const API_URL = "https://Worker-production-179b.up.railway.app";
let currentUserEmail = "";

// دالة تستقبل بيانات المستخدم من جوجل عند نجاح تسجيل الدخول
async function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    currentUserEmail = responsePayload.email;
    
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    document.getElementById("user-name").innerText = responsePayload.name;
    document.getElementById("system-status").innerText = "جاري مزامنة البيانات مع قاعدة Neon...";

    // إرسال الإيميل للسيرفر لإنشاء/جلب الحساب
    await triggerAction("LOGIN");
}

// =========================================
// 💰 دوال بوابة الدفع الآلية (تم الحقن هنا)
// =========================================

// دالة إظهار نافذة الدفع المخفية
function showPaymentGateway() {
    document.getElementById("payment-section").classList.remove("hidden");
    document.getElementById("system-status").innerText = "بانتظار إتمام الدفع ووضع معرف المعاملة (TXID)...";
    document.getElementById("system-status").style.color = "#e67e22";
}

// دالة إرسال الـ TXID للسيرفر للتحقق عبر TronGrid
async function verifyPayment() {
    // جلب القيمة من المربع وإزالة الفراغات
    const txid = document.getElementById("txid-input").value.trim();
    const statusText = document.getElementById("system-status");
    
    // فحص مبدئي للتأكد من أن الـ TXID ليس فارغاً وطوله منطقي
    if (txid.length < 30) {
        alert("الرجاء إدخال معرف معاملة (TXID) صحيح!");
        return;
    }

    statusText.innerText = "جاري فحص البلوكشين... الرجاء الانتظار ⏳";
    statusText.style.color = "#2980b9";

    try {
        const res = await fetch(`${API_URL}/api/action`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail, action: "VERIFY_PAYMENT", txid: txid })
        });
        const data = await res.json();
        
        if(data.status === "success") {
            statusText.innerText = data.message;
            statusText.style.color = "#27ae60";
            document.getElementById("payment-section").classList.add("hidden");
            // تحديث الرصيد في الواجهة فور نجاح العملية
            document.getElementById("gas-balance").innerText = "50.00$";
        } else {
            // في حال كان الـ TXID خاطئاً أو المبلغ ناقصاً
            statusText.innerText = data.message;
            statusText.style.color = "#c0392b";
        }
    } catch (error) {
        statusText.innerText = "خطأ في الاتصال بشبكة التحقق السحابية.";
        statusText.style.color = "#c0392b";
    }
}
// =========================================

// دالة تنفيذ الإجراءات والتواصل مع Railway
async function triggerAction(actionType) {
    // 🛑 اعتراض أمر الشحن لفتح البوابة بدلاً من إرساله فوراً
    if (actionType === 'RECHARGE') {
        showPaymentGateway();
        return;
    }

    const statusText = document.getElementById("system-status");
    statusText.innerText = "جاري الاتصال بالمحرك السحابي...";
    statusText.style.color = "#7f8c8d";

    try {
        const res = await fetch(`${API_URL}/api/action`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail, action: actionType })
        });
        const data = await res.json();
        
        if(data.status === "success") {
            statusText.innerText = data.message;
            statusText.style.color = "#27ae60";
            if(data.balance !== undefined) document.getElementById("gas-balance").innerText = data.balance + "$";
            if(data.rank !== undefined) document.getElementById("user-rank").innerText = data.rank;
        } else {
            statusText.innerText = data.message || "حدث خطأ غير معروف.";
            statusText.style.color = "#c0392b";
        }
    } catch (error) {
        statusText.innerText = "خطأ في الاتصال بسيرفر Railway.";
        statusText.style.color = "#c0392b";
    }
}

// دالة مساعدة لفك تشفير بيانات جوجل
function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

