// node run.js BTCUSDT strategyName true 1
const config = require('./../config.js');
const path = require('path');
const ObjectsToCsv = require('objects-to-csv');
const csv = require('csv-parser')
const fs = require('fs')
 

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
    APIKEY: '<key>',
    APISECRET: '<secret>',
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

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}   

// If you use "await", code must be inside an asynchronous function:
async function saveToCsv(data){
    const csv = new ObjectsToCsv(data);
    // Save to file:
    await csv.toDisk('./BTCUSDT_1d.csv');
};

const init = async () => {

    if(config.csvFile){
        let longTimeCandles = []
        fs.createReadStream(config.csvFile)
        .pipe(csv())
        .on('data', (data) => {
                longTimeCandles.unshift(data)
        })
        .on('end', () => {
            for (let i = 0; i < longTimeCandles.length; i++) {
                try{
                    if(i === minCandles) bot.enoughCandles = true;
                    bot.actualCandle = {
                        time: longTimeCandles[i].time,
                        open: parseFloat(longTimeCandles[i].open),
                        high: parseFloat(longTimeCandles[i].high),
                        low: parseFloat(longTimeCandles[i].low),
                        close: parseFloat(longTimeCandles[i].close),
                        volume: parseFloat(longTimeCandles[i].volume),
                    }
                    strategyData.onCandle(bot)
                    bot.lookback.unshift(bot.actualCandle);
                }catch( error){
                    console.log(error)
                }
            }
        });
        return;
    }

    //let timeToGet = config.date.getTime() || timeUntillNow; NOVA
    let timeToGet = timeUntillNow; 

    let intervalTime = interval.replace( /\D+/, '');
    let intervalType = interval.replace( /\d+/, '');
    let intervalNumber;
    if(intervalType === 'm'){
        intervalNumber = 60;
    } else if (intervalType === 'h'){
        intervalNumber = 3600;
    } else if (intervalType === 'd'){
        intervalNumber = 86400;
    }

    let longTimeCandles = []
    try {
        for (let i = 0; i < 18; i++){
            console.log("PETITION")
            let ticks = await binance.candlesticks(bot.pair, interval , false, {limit: candleLimit, endTime: timeToGet});
            if (i == 0) ticks.pop(); // Eliminamos el valor actual
            for(j = ticks.length - 1; j >= 0; j--){
                longTimeCandles.unshift(ticks[j])
            }
            timeToGet -= candleLimit * (intervalNumber * intervalTime) * 1000; // Candles + 1 * (60 * time) * 1000
            await sleep(3000);
        }

        for (let i = 0; i < longTimeCandles.length; i++) {
            if(i === minCandles) bot.enoughCandles = true;
            let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = longTimeCandles[i];
            bot.actualCandle = {
                time: calculateTime(time),
                open: parseFloat(open),
                high: parseFloat(high),
                low: parseFloat(low),
                close: parseFloat(close),
                volume: parseFloat(volume),
            }
            //strategyData.onCandle(bot)
            bot.lookback.unshift(bot.actualCandle);
        }
        saveToCsv(bot.lookback)
    } catch(error){
        console.log(error)
        console.log("ERROR: " + JSON.stringify(error));
    }
}

init();