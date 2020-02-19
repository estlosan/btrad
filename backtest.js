const config = require('./configBacktest.js');
const path = require('path');
const ema = require('./indicators/ema');
const sma = require('./indicators/sma');

const interval = config.interval;
const pair = config.pair;
const candleLimit = config.candleLimit;


//CONSTS

const timeUntillNow = Date.now();

//PaperTrading
let paperTrading = {};
paperTrading.initialMoney = 1000;
paperTrading.money = 1000;     //quantity*price=money
paperTrading.quantity = 0;
paperTrading.state = 'initial';

//CODE

let strategyData = require(path.resolve(__dirname, `./strategies/${config.strategyName}/strategy.js`))

const binance = require('node-binance-api')().options({
    APIKEY: config.apiKey,
    APISECRET: config.apiSecret,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

let lookback = [];
let actualCandles = [];

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks(pair, interval, (error, ticks, symbol) => {
    ticks.pop(); // Eliminamos el valor actual
    let lookbackAux = ticks.slice(0, 200);
    let actualCandlesAux = ticks.slice(200, ticks.length);
    for (let i = lookbackAux.length - 1; i >= 0; i--) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = lookbackAux[i];
        candleObj = {
            time: time,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        lookback.push(candleObj);
    }

    for (let i = 0; i < actualCandlesAux.length; i++) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = actualCandlesAux[i];
        candleObj = {
            time, time,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        actualCandles.push(candleObj);
    }

    for (let i = 40 - 1; i >= 0; i--) {
        let auxLookback = lookback.slice();
        auxLookback = auxLookback.slice(i + 1, lookback.length);
        lookback[i]["ema6"] = parseFloat(ema(auxLookback, lookback[i], "ema6", 6))
        lookback[i]["sma100"] = parseFloat(sma(auxLookback, lookback[i], 100))
    }

    //STRATEGY
    for (let i = 0; i < actualCandles.length; i++){
        strategyData.onCandle(lookback, actualCandles[i], paperTrading);
        actualCandles[i]["ema6"] = parseFloat(ema(lookback, actualCandles[i], "ema6", 6))
        actualCandles[i]["sma100"] = parseFloat(sma(lookback, actualCandles[i], 100))
        lookback.pop();
        lookback.unshift(actualCandles[i]);
    }
}, {limit: candleLimit, endTime: timeUntillNow});

