// node run.js BTCUSDT strategyName true 1
const { loadConfig, initBot, getBacktestCandles, calculateTime } = require('./helpers.js')
const { sendMsg } = require('./../node/telegramBot');
const config = require('./../config.js');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
   
// BINANCE API

const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

// CODE


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
    let {
        timeUntillNow,
        interval,
        candleLimit,
        minCandles,
        strategyData
    } = loadConfig()
    let bot = initBot();
    interval = interval[0] 
    try {
        await getBacktestCandles(bot, interval, candleLimit, timeUntillNow, minCandles, strategyData);

        console.log("_______________________________BOT___________________________")
        console.log(JSON.stringify(bot))

        if(bot.realTime){
            
            bot.realTrading = true;
            bot.tradingMoney = process.argv[5] || config.tradingMoney;
            bot.money = localStorage.getItem(`${bot.pair}_moneyToBuy`) || bot.tradingMoney;     //quantity*price=money
            bot.quantity = localStorage.getItem(`${bot.pair}_tokensToSell`) || 0;
            bot.state = localStorage.getItem(`${bot.pair}_state`) || 'initial';
            
            console.log("Starting real trading bot with: \n")
            console.log(`Strategy: ${bot.strategyName}`)
            console.log(`Money: ${bot.money}`)
            console.log(`Quantity: ${bot.quantity}`)
            console.log(`State: ${bot.state}`)
            console.log(`TakeProfit: ${bot.takeProfit}`)
            console.log(`StopLoss: ${bot.stopLoss}`)

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
    } catch(error){
        console.log("ERROR: " + error);
        sendMsg('-402612640', error);
    }
}

init();