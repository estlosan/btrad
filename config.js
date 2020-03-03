let config = {};

config.pair = "BTCUSDT";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
config.interval = "1d";

config.candleLimit = 365 + 100 + 1; //Obtiene la actual y la borramos (Velas + Aditivo + Pop)
config.strategyName = "threeIndicators";

config.tradingMode = "backtest";

//BINANCE API
config.apiKey = '<key>';
config.apiSecret = '<secret>';


module.exports = config;