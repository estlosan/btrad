
const config = require('./../config.js');
const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

let bot = {};

bot.actualCandle = undefined;
bot.period = {}
bot.lookback = [];
bot.pair = config.pair;
bot.realTime = config.realTime;
const timeUntillNow = Date.now();
const interval = config.interval;
const candleLimit = config.candleLimit;

const init = async () => {

    return new Promise((resolve, reject) => {
        binance.candlesticks(bot.pair, interval, (error, ticks, symbol) => {
            if(error) reject(error)
            resolve(ticks)
        }, {limit: candleLimit, endTime: timeUntillNow});
    });
    let candles = await promise
    console.log(candles)
}

init().then((res)=> {
    console.log(res)
    console.log("DONE")
})

