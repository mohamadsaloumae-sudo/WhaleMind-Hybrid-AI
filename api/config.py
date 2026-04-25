# WhaleMind AI - Global Configuration
class BaseConfig:
    VERSION = "60.0.1 Titanium"
    ADMIN_FEE_USDT = 5000
    WHALE_THRESHOLD_USD = 5000000  # 5 مليون دولار
    SUPPORTED_NETWORKS = ["ERC20", "BEP20", "SOLANA"]
    
    # روابط السيرفرات (RPC Nodes) للربط اللامركزي مستقبلاً
    NODES = {
        "ETH": "https://eth-mainnet.g.alchemy.com/v2/your-api-key",
        "BSC": "https://bsc-dataseed.binance.org/"
    }
