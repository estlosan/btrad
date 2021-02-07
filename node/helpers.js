const path = require('path');
const config = require('./../config.js');
const binance = require('node-binance-api')().options({
    APIKEY: '<key>',
    APISECRET: '<secret>',
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    recvWindow: 60000,
});

const loadConfig = () => {
    const fromDate = config.fromDate || config.candleLimit;
    const toDate = config.toDate || Date.now();
    const interval = config.interval;
    const strategyName = process.argv[3] || config.strategyName
    const minCandles = config.minCandles;
    const candleLimit = config.candleLimit;
    const strategyData = require(path.resolve(__dirname, `./../strategies/${strategyName}/strategy.js`))
    const csvRoute = config.csvRoute;
    return {
        fromDate,
        toDate,
        interval,
        minCandles,
        candleLimit,
        strategyData,
        csvRoute
    }
}

const initBot = () => {
    let bot = {};

    bot.actualCandle = undefined;
    bot.period = {}
    bot.lookback = [];
    bot.pair = config.pair;
    bot.realTime = config.realTime;

    bot.tradingMoney = config.tradingMoney;

    bot.benefice = 0;

    bot.buyPrice = 0;
    bot.takeProfit = process.argv[6] || config.takeProfit;
    bot.stopLoss = - (process.argv[7] || config.stopLoss);

    bot.money = bot.tradingMoney;     //quantity*price=money
    bot.prevMoney = 0;
    bot.quantity = 0;
    bot.state = 'initial';

    return bot
}

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
const getCandleHistory = async (pair, interval, candleLimit, timeUntillNow) => {
    return new Promise((resolve, reject) => {
        binance.candlesticks(pair, interval, (error, ticks, symbol) => {
            if(error) reject(error)
            resolve(ticks)
        }, {limit: candleLimit, endTime: timeUntillNow});
    });
}

const getBacktestCandles = async (bot, interval, candleLimit, timeUntillNow, minCandles, strategyData) => {
    let ticks = await getCandleHistory(bot.pair, interval, candleLimit, timeUntillNow)
    ticks.pop(); // Eliminamos el valor actual
    for (let i = 0; i < ticks.length; i++) {
        if(i === minCandles) bot.enoughCandles = true;
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = ticks[i];
        bot.actualCandle = {
            time: calculateTime(time),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        strategyData.onCandle(bot)
        bot.lookback.unshift(bot.actualCandle);
    }
}

module.exports = { loadConfig, initBot, getBacktestCandles, getCandleHistory, calculateTime }