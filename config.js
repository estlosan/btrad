const dotenv = require('dotenv');
dotenv.config();

let config = {};

config.pair = process.argv[2] || "BTTUSDT";

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
config.interval = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "1d"];
//config.interval = ["1h", "4h", "1d"];

config.minCandles = 145; // Velas necesarias para ejecutar la estrategia
config.candleLimit = 400 // Velas por peticion a binance
config.strategyName = process.argv[3] || "atr_trailing_stop_buena_ada";
//config.csvRoute = "/backtest/1Ene2019_1Ene2020/"
config.csvRoute = "/backtest/1Oct2017_1Ene2021ADA/"

//config.date = new Date(Date.UTC('2020','04','19','18','51','00'));
config.fromDate = 1506808800000;
config.toDate = 1609455600000;

//config.fromDate = 1506808800000;
//config.toDate = 1609455600000;

config.realTrading = (process.argv[4] == 'true') || false;

//BINANCE API
config.apiKey = process.env.BOT_API;
config.apiSecret = process.env.BOT_APIKEY;

config.tradingMoney = parseFloat(process.argv[5]) || 100;

config.takeProfit = process.argv[6] || 2;
config.stopLoss = - (process.argv[7] || 1);

module.exports = config;
