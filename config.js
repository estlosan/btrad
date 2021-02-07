const dotenv = require('dotenv');
dotenv.config();

let config = {};

config.pair = process.argv[2] || "BTCUSDT";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
//config.interval = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1d"];
config.interval = ["4h"];

config.minCandles = 100; // Velas necesarias para ejecutar la estrategia
config.candleLimit = 400 // Velas por peticion a binance
config.strategyName = "wma2";
//config.csvRoute = "/backtest/1Ene2019_1Ene2020/"
config.csvRoute = "/backtest/1Ene2018_1Ene2019/"

//config.date = new Date(Date.UTC('2020','04','19','18','51','00'));
config.fromDate = 1546297200000;
config.toDate = 1577833200000;

config.realTime = process.argv[4] || false;

//BINANCE API
config.apiKey = process.env.BOT_API;
config.apiSecret = process.env.BOT_APIKEY;

config.tradingMoney = process.argv[5] || 100;

config.takeProfit = 2;
config.stopLoss = 1;

module.exports = config;