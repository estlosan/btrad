let config = {};

config.pair = "BNBBTC";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
config.interval = "1d";

config.candleLimit = 365 + 200; //Obtiene la actual y la borramos
config.strategyName = "backtestingTest";


//BINANCE API
config.apiKey = '<key>';
config.apiSecret = '<secret>';


module.exports = config;