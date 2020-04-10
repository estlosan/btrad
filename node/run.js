// node run.js BTCUSDT strategyName true 1
const { sendMsg } = require('./../node/telegramBot');
const config = require('./../config.js');
const path = require('path');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
   

// BOT

let bot = {};

bot.actualCandle = undefined;
bot.lookback = [];
bot.pair = process.argv[2] || config.pair;
bot.realTime = process.argv[4] || config.realTime;

bot.tradingMoney = process.argv[5] || config.tradingMoney;
bot.money = bot.tradingMoney;     //quantity*price=money
bot.quantity = 0;
bot.state = 'initial';

// INITIAL CONFIG

const timeUntillNow = Date.now();
const interval = config.interval;
const strategyName = process.argv[3] || config.strategyName
const candleLimit = config.candleLimit;
const minCandles = config.minCandles;
const strategyData = require(path.resolve(__dirname, `./../strategies/${strategyName}/strategy.js`))


// BINANCE API

const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
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

const calculateMinQuantity = async () => {
    try {
        let data = await binance.exchangeInfo(); 
        for(let i = 0; i < data.symbols.length; i++){
            if(data.symbols[i].symbol === bot.pair){
                let filters = data.symbols[i].filters
                for ( let filter of filters ) {
                    if ( filter.filterType == "LOT_SIZE" ) {
                        return filter.minQty.replace('.','').indexOf('1')
                    }
                }
            }
        }
    } catch(error){
        console.log(error)
    }
    
}

const init = async () => {

    try {
        // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
        binance.candlesticks(bot.pair, interval, (error, ticks, symbol) => {
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

            if(bot.realTime){
                
                bot.realTrading = true;
                bot.tradingMoney = process.argv[5] || config.tradingMoney;
                bot.money = localStorage.getItem(`${bot.pair}_moneyToBuy`) || bot.tradingMoney;     //quantity*price=money
                bot.quantity = localStorage.getItem(`${bot.pair}_tokensToSell`) || 0;
                bot.state = localStorage.getItem(`${bot.pair}_state`) || 'initial';
                
                console.log("Starting real trading bot with: \n")
                console.log(`Money: ${bot.money}`)
                console.log(`Quantity: ${bot.quantity}`)
                console.log(`State: ${bot.state}`)

                binance.websockets.candlesticks([bot.pair], interval, (candlesticks) => {
                    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
                    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
                    bot.actualCandle = {
                        time: calculateTime(eventTime),
                        open: parseFloat(open),
                        high: parseFloat(high),
                        low: parseFloat(low),
                        close: parseFloat(close),
                        volume: parseFloat(volume),
                    }
                    if (isFinal) {
                        console.log("\n");
                        console.log(`\n > New Candle ${bot.actualCandle.time}`);
                        calculateMinQuantity()
                        .then((result) => {
                            bot.minQty = result;
                            console.log(bot.minQty)
                            bot.lookback.pop();
                            strategyData.onCandle(bot);
                            bot.lookback.unshift(bot.actualCandle);    
                        })
                    }
                    else{
                    // Strategy
                        strategyData.onRealTime(bot);
                    }
                });
            }
        }, {limit: candleLimit, endTime: timeUntillNow});
    } catch(error){
        sendMsg('-402612640', error);
        console.log("ERROR: " + JSON.stringify(error));
    }
}

init();