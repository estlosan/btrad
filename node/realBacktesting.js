const { loadConfig, initBot, getCandleHistory, calculateTime } = require('./helpers.js')
const ObjectsToCsv = require('objects-to-csv');
const csv = require('csv-parser')
const fs = require('fs')

const CSV_ROUTE = "/backtest/"

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

// If you use "await", code must be inside an asynchronous function:
const saveToCSV = async (data, csvFile) => {
    const csv = new ObjectsToCsv(data);
    // Save to file:
    await csv.toDisk(csvFile);
};

const binanceBacktestToCSV = async (pair, interval, candleLimit, timeUntillNow, csvFile) => {
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
    for (let i = 0; i < 3; i++){
        console.log(`\t Calling Binance History`)
        let ticks = await getCandleHistory(pair, interval, candleLimit, timeToGet);
        if (i == 0) ticks.pop(); // Eliminamos el valor actual
        longTimeCandles.unshift(...ticks)
        timeToGet -= candleLimit * (intervalNumber * intervalTime) * 1000; // Candles + 1 * (60 * time) * 1000
        await sleep(3000);
    }

    let lookback = []
    for (let i = 0; i < longTimeCandles.length; i++) {
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = longTimeCandles[i];
        let actualCandle = {
            time: calculateTime(time),
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
        }
        lookback.unshift(actualCandle);
    }
    await saveToCSV(lookback, csvFile)
}

const getBacktestCandlesCSV = (bot, csvFile, strategyData, minCandles) => {
    return new Promise((resolve, reject) => {
        let longTimeCandles = []
        fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (data) => {
            longTimeCandles.unshift(data)
        })
        .on('end', () => {
            try{
                for (let i = 0; i < longTimeCandles.length; i++) {
                
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
                }
                resolve()
            }catch(error){
                console.log(error)
                reject(error)
            }
        });
    });
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
    try {
        let results = []
        for (const time of interval){
            let csvFile = __dirname + CSV_ROUTE + `${bot.pair}_${time}.csv`
            if (!fs.existsSync(csvFile)) {
                await binanceBacktestToCSV(bot.pair, time, candleLimit, timeUntillNow, csvFile)
            } 
            await getBacktestCandlesCSV(bot, csvFile, strategyData, minCandles);
            await sleep(3000)
            results.push(bot.benefice)
            bot = initBot()
        }
        console.log(`Benefice: ${results}`)
    } catch (err) {
        console.log(err)
    }
}

init()

