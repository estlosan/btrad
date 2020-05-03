const dotenv = require('dotenv');
dotenv.config();

let config = {};

config.pair = "BTCUSDT";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
config.interval = "1d";

config.minCandles = 100;
config.candleLimit = 350 + config.minCandles + 1; //Obtiene la actual y la borramos (Velas + Aditivo + Pop)
config.strategyName = "ema50-wma200";
//config.date = new Date(Date.UTC('2020','04','19','18','51','00'));

config.csvFile = 'BTCUSDT_1min.csv'

config.realTime = false;

//BINANCE API
config.apiKey = process.env.BOT_API;
config.apiSecret = process.env.BOT_APIKEY;

config.tradingMoney = 1;

module.exports = config;