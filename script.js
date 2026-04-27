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

async function triggerAction(actionType) {
    const statusText = document.getElementById("system-status");
    statusText.innerText = "جاري الاتصال بالمحرك السحابي...";

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

