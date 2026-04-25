// WhaleMind AI - Global Hybrid Bridge (Titanium 60 Edition)
const GlobalBridge = {
    // 1. جسر المنصات المركزية (CEX) - الربط عبر الدماغ الخلفي
    async fetchCexData(exchangeId, apiKey, apiSecret) {
        console.log(`🚀 تفعيل جسر CCXT للربط مع ${exchangeId}...`);
        try {
            // نرسل المفاتيح للدماغ ليقوم هو بالعملية الصعبة بعيداً عن المتصفح
            const response = await fetch('/api/connect-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ exchange: exchangeId, apiKey, apiSecret })
            });
            const data = await response.json();
            return data.status === "SUCCESS" ? parseFloat(data.balance) : 0;
        } catch (e) {
            console.error("❌ تعطل جسر المنصات المركزية");
            return 0;
        }
    },

    // 2. جسر البلوكشين (DEX & Wallets) - ربط Web3 المباشر
    async connectBlockchain() {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                console.log("✅ تم ربط المحفظة اللامركزية:", accounts[0]);
                return accounts[0];
            } catch (error) {
                console.error("⚠️ رفض الاتصال بمحفظة Web3");
                return null;
            }
        } else {
            alert("يرجى تنصيب محفظة Web3 (مثلاً MetaMask) لتفعيل ميزات DEX");
            return null;
        }
    },

    // 3. الموحد المالي (The Aggregator)
    // هنا يخدم الجسر الملف الرئيسي عن طريق جمع الأرصدة في رقم واحد
    async syncTotalBalance() {
        const statusEl = document.getElementById('system-status');
        if(statusEl) statusEl.innerText = "⏳ جاري مزامنة الأرصدة الموحدة...";

        // جلب رصيد باينانس (أو أي منصة) عبر الدماغ
        const cexBal = await this.fetchCexData('binance');
        
        // جلب رصيد المحفظة (افتراضي 0 حالياً حتى تفعيل منطق Web3 كاملاً)
        const dexBal = 0; 

        const total = cexBal + dexBal;
        const totalEl = document.getElementById('total-balance');
        if(totalEl) {
            totalEl.innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        }
        
        if(statusEl) statusEl.innerText = "🟢 تم تحديث المحفظة الموحدة";
    }
};

// تفعيل المزامنة عند الضغط على زر الربط في الواجهة
document.addEventListener('DOMContentLoaded', () => {
    console.log("💎 WhaleMind Global Bridge Active");
});

