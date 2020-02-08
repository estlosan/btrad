let config = {};

config.pair = "BNBBTC";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
config.interval = "1m";

config.candleLimit = 100 + 1; //Obtiene la actual y la borramos
config.strategyName = "crossLines";


//BINANCE API
config.apiKey = '<key>';
config.apiSecret = '<secret>';


//INDICATORS
config.indicators = ["ema9"]

module.exports = config;