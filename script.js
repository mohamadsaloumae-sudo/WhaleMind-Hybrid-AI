const API_URL = "https://Worker-production-179b.up.railway.app";
let currentUserEmail = "";
let currentWallet = null;

// =========================================
// 🔐 تسجيل الدخول والمصادقة
// =========================================
async function handleCredentialResponse(response) {
    const responsePayload = decodeJwtResponse(response.credential);
    currentUserEmail = responsePayload.email;
    
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    document.getElementById("user-name").innerText = responsePayload.name;
    
    updateStatus("جاري مزامنة بياناتك مع المحرك المركزي...", "#94a3b8");
    await triggerAction("LOGIN");
    
    // تحميل شاشة السوق لتبقى جاهزة
    loadTradingView();
}

function decodeJwtResponse(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// =========================================
// 🎛️ التحكم بالواجهة والتبويبات
// =========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabId).classList.remove('hidden');
    event.target.classList.add('active');
}

function toggleSetup(type) {
    document.getElementById("cex-setup").classList.add("hidden");
    document.getElementById("dex-setup").classList.add("hidden");
    document.getElementById(`${type}-setup`).classList.remove("hidden");
}

function updateStatus(msg, color) {
    const statusText = document.getElementById("system-status");
    statusText.innerText = msg;
    statusText.style.color = color;
}

// =========================================
// 🚀 إعدادات التداول (API & Web3)
// =========================================
async function saveTradingConfig() {
    const apiKey = document.getElementById("api-key").value.trim();
    const apiSecret = document.getElementById("api-secret").value.trim();
    const riskLevel = document.getElementById("risk-level").value;

    if(!apiKey || !apiSecret) {
        alert("الرجاء إدخال المفاتيح كاملة لربط المنصة المركزية."); 
        return;
    }

    updateStatus("جاري تشفير وإرسال المفاتيح لغرفة العمليات...", "#f59e0b");

    try {
        const res = await fetch(`${API_URL}/api/save_keys`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: currentUserEmail, 
                api_key: apiKey, 
                api_secret: apiSecret,
                risk: riskLevel
            })
        });
        const data = await res.json();
        
        if(data.status === "success") {
            updateStatus("✅ تم تفعيل الروبوت والتشفير بنجاح!", "#10b981");
            document.getElementById("api-key").value = "";
            document.getElementById("api-secret").value = "";
        } else {
            updateStatus(data.message || "حدث خطأ أثناء الربط.", "#ef4444");
        }
    } catch (error) {
        updateStatus("فشل الاتصال بسيرفر التنفيذ المركزي.", "#ef4444");
    }
}

async function connectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            updateStatus("جاري طلب الاتصال بمحفظة Web3...", "#8b5cf6");
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            currentWallet = accounts[0];
            
            document.getElementById("wallet-address").innerText = `${currentWallet.substring(0, 6)}...${currentWallet.substring(38)}`;
            toggleSetup('dex');
            updateStatus("تم ربط المحفظة اللامركزية بنجاح.", "#10b981");
            
        } catch (error) {
            updateStatus("تم رفض الاتصال بالمحفظة من قبل المستخدم.", "#ef4444");
        }
    } else {
        alert("الرجاء تثبيت إضافة محفظة (مثل MetaMask) أولاً!");
    }
}

function activateDEXTraiding() {
    if(!currentWallet) return;
    updateStatus("تم تجهيز العقد الذكي للتداول. بانتظار إشارات الحيتان...", "#10b981");
}

// =========================================
// 💳 نظام الفحص الآلي للمدفوعات (الجديد)
// =========================================
async function verifyPaymentAuto() {
    const btn = document.getElementById("verify-btn");
    
    btn.disabled = true;
    btn.innerText = "⏳ جاري مسح شبكة TRC20...";
    updateStatus("رادار المدفوعات يبحث عن تحويلك في البلوكتشين...", "#3b82f6");

    try {
        const res = await fetch(`${API_URL}/api/verify_auto`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail })
        });
        const data = await res.json();
        
        if(data.status === "success") {
            updateStatus("✅ تم التقاط الدفعة! تم شحن الغاز بنجاح.", "#10b981");
            document.getElementById("gas-balance").innerText = data.new_balance + "$";
            btn.innerText = "✔️ اكتمل الشحن";
        } else if (data.status === "pending") {
            updateStatus("⚠️ لم يتم رصد الدفعة بعد. الشبكة قد تستغرق دقائق، حاول الفحص مجدداً.", "#f59e0b");
            btn.disabled = false;
            btn.innerText = "🔄 فحص الشبكة مرة أخرى";
        } else {
            updateStatus(data.message || "حدث خطأ غير معروف.", "#ef4444");
            btn.disabled = false;
            btn.innerText = "🔄 إعادة الفحص";
        }
    } catch (error) {
        updateStatus("خطأ في الاتصال بمحرك التحقق السحابي.", "#ef4444");
        btn.disabled = false;
        btn.innerText = "🔄 إعادة الفحص";
    }
}

// =========================================
// 📡 الاتصال العام (جلب الرصيد والرتبة)
// =========================================
async function triggerAction(actionType) {
    try {
        const res = await fetch(`${API_URL}/api/action`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUserEmail, action: actionType })
        });
        const data = await res.json();
        if(data.status === "success") {
            if(data.balance !== undefined) document.getElementById("gas-balance").innerText = data.balance + "$";
            if(data.rank !== undefined) document.getElementById("user-rank").innerText = data.rank;
        }
    } catch (error) {
        console.error("Connection Error:", error);
    }
}

// =========================================
// 📊 شاشة السوق العالمية (TradingView)
// =========================================
function loadTradingView() {
    const container = document.getElementById("tv-widget");
    container.innerHTML = `
        <iframe src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=BINANCE%3ABTCUSDT&interval=15&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=0f172a&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=ar&utm_source=&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE%3ABTCUSDT" 
        width="100%" height="100%" frameborder="0" allowtransparency="true" scrolling="no" allowfullscreen></iframe>
    `;
}
