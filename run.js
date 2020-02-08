const config = require('./config.js');
const path = require('path');
const ema = require('./indicators/ema');

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

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks(pair, interval, (error, ticks, symbol) => {
    ticks.pop(); // Eliminamos el valor actual
    for (let i = ticks.length - 1; i >= 0; i--) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = ticks[i];
        candleObj = {
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        lookback.push(candleObj);
    }

    for (let i = 40 - 1; i >= 0; i--) {
        let auxLookback = lookback.slice();
        auxLookback = auxLookback.slice(i + 1, lookback.length);
        lookback[i]["ema9"] = parseFloat(ema(auxLookback, lookback[i], "ema9", 9))
    }
    strategyData.onRealTime(lookback.slice(1, lookback.length), lookback[0], paperTrading); //BackTEST
}, {limit: candleLimit, endTime: timeUntillNow});

binance.websockets.candlesticks([pair], interval, (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.log(symbol+" "+interval+" candlestick update");
    let actualCandle = {
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
    }
    if (isFinal) {
        lookback.pop();
        console.log(lookback[0]);
        actualCandle.ema9 = parseFloat(ema(lookback, actualCandle, "ema9", 9))
        lookback.unshift(actualCandle);
        console.log(lookback[0]);
    }
    else{
    // Strategy
        strategyData.onRealTime(lookback, actualCandle, paperTrading);
    }
});