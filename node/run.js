// node run.js BTCUSDT strategyName backtest
const config = require('./../config.js');
const path = require('path');

// BOT

let bot = {};

bot.actualCandle = undefined;
bot.lookback = [];
bot.pair = process.argv[2] || config.pair;
bot.tradingMode = process.argv[4] || config.tradingMode;


// INITIAL CONFIG

const timeUntillNow = Date.now();
const interval = config.interval;
const strategyName = process.argv[3] || config.strategyName
const candleLimit = config.candleLimit;
const strategyData = require(path.resolve(__dirname, `./../strategies/${strategyName}/strategy.js`))

//PaperTrading
let paperTrading = {};
paperTrading.initialMoney = 1000;
paperTrading.money = 1000;     //quantity*price=money
paperTrading.quantity = 0;
paperTrading.state = 'initial';


// BINANCE API

const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

binance.balance((error, balances) => {
    if ( error ) return console.error(error);
    let coin = bot.pair.slice(0,3).toString();
    console.log(`${coin} balance: ${balances[coin].available}`);
});


// CODE

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

try{
    // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
    binance.candlesticks(bot.pair, interval, (error, ticks, symbol) => {
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

        if(bot.tradingMode == "realTime"){
            binance.websockets.candlesticks([bot.pair], interval, (candlesticks) => {
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
                    console.log(`\n > New Candle ${bot.actualCandle.time}`);
                    bot.lookback.pop();
                    strategyData.onCandle(bot, paperTrading);
                    bot.lookback.unshift(bot.actualCandle);
                }
                else{
                // Strategy
                    strategyData.onRealTime(bot, paperTrading);
                }
            });
        }
    }, {limit: candleLimit, endTime: timeUntillNow});
} catch (error){
    console.log(`Error in ${bot.pair}`);
}