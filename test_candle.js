const config = require('./config.js');
const path = require('path');

const binance = require('node-binance-api')().options({
    APIKEY: config.apiKey,
    APISECRET: config.apiSecret,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

binance.candlesticks("BNBBTC", "1m", (error, ticks, symbol) => {
    console.log("candlesticks()", ticks);
    let last_tick = ticks[ticks.length - 1];
    let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
    console.log(symbol+" last close: "+close);
  }, {limit: 500, endTime: 1514764800000});