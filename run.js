const config = require('./config.js');
const path = require('path');

const interval = config.interval;
const pair = config.pair;
const candleLimit = config.candleLimit;
const tradingMode = config.tradingMode;

const binance = require('node-binance-api')().options({
    APIKEY: config.apiKey,
    APISECRET: config.apiSecret,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

//CONSTS

let bot = {};

const timeUntillNow = Date.now();

//PaperTrading
let paperTrading = {};
paperTrading.initialMoney = 1000;
paperTrading.money = 1000;     //quantity*price=money
paperTrading.quantity = 0;
paperTrading.state = 'initial';

//CODE

let strategyData = require(path.resolve(__dirname, `./strategies/${config.strategyName}/strategy.js`))


bot.actualCandle = undefined;
bot.lookback = [];


function calculateTime(timestamp){
    let a = new Date(timestamp);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let timeInDate = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return timeInDate;
}

// Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
binance.candlesticks(pair, interval, (error, ticks, symbol) => {
    ticks.pop(); // Eliminamos el valor actual
    for (let i = 0; i < ticks.length; i++) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = ticks[i];
        bot.actualCandle = {
            time: calculateTime(time),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        strategyData.onCandle(bot, paperTrading)
        bot.lookback.unshift(bot.actualCandle);
    }
}, {limit: candleLimit, endTime: timeUntillNow});

binance.websockets.candlesticks([pair], interval, (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.log(symbol+" "+interval+" candlestick update");
    bot.actualCandle = {
        time: calculateTime(eventTime),
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
    }
    if (isFinal) {
        console.log(' > New Candle')
        console.log(bot.actualCandle.time)
        bot.lookback.pop();
        strategyData.onCandle(bot, paperTrading);
        console.log(bot.actualCandle.macd)
        console.log(bot.actualCandle.signal)
        console.log(bot.actualCandle.histogram)
        bot.lookback.unshift(bot.actualCandle);
    }
    else{
    // Strategy
        strategyData.onRealTime(bot, paperTrading);
    }
});