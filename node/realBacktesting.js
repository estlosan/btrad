const { loadConfig, initBot, getCandleHistory, calculateTime } = require('./helpers.js')
const ObjectsToCsv = require('objects-to-csv');
const csv = require('csv-parser')
const fs = require('fs');

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

const binanceBacktestToCSV = async (pair, interval, fromDate, toDate, candleLimit, csvFile) => {

    try {
        let timeToGet = toDate; 

        let intervalTime = interval.replace( /\D+/, '');
        let intervalType = interval.replace( /\d+/, '');
        let intervalNumber;
        if(intervalType === 'm'){
            intervalNumber = intervalTime * 60;
        } else if (intervalType === 'h'){
            intervalNumber = intervalTime * 3600;
        } else if (intervalType === 'd'){
            intervalNumber = intervalTime * 86400;
        }

        let passedTime = (toDate - fromDate) / 1000; // Segundos que han pasado

        let candles = Math.ceil(passedTime / intervalNumber) // Velas totales necesarias

        let aproxLoops = Math.ceil(candles / candleLimit);

        let longTimeCandles = []
        console.log(`\t Calling Binance History: ${calculateTime(fromDate)} to ${calculateTime(toDate)}`)
        console.log(`\t Calling Binance History: ${pair} --> ${interval}`)
        console.log(`\t Total candles: ${candles - aproxLoops}`);
        for (let i = 0; candles > 0; i++){
            console.log(`\t Call: ${i + 1} of: ${aproxLoops}`)
            if((candles - candleLimit) < 0){
                let ticks = await getCandleHistory(pair, interval, candles, timeToGet);
                ticks.pop(); // Eliminamos el valor actual
                longTimeCandles.unshift(...ticks)
                break;
            }
            else{
                let ticks = await getCandleHistory(pair, interval, candleLimit, timeToGet);
                ticks.pop(); // Eliminamos el valor actual
                longTimeCandles.unshift(...ticks);
                timeToGet = ticks[0][0];
            }
            candles -= candleLimit;
            await sleep(2000);
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
    } catch (error){
        console.log("--------------ERROR BINANCE---------------")
        console.log(error)
    }
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
                console.log("--------------ERROR CSV READ---------------")
                console.log(error)
                reject(error)
            }
        });
    });
}

const init = async () => {
    let {
        fromDate,
        toDate,
        interval,
        minCandles,
        candleLimit,
        strategyData,
        csvRoute
    } = loadConfig()
    let bot = initBot();
    try {
        let results = {};
        for (const time of interval){
            let csvFile = __dirname + csvRoute + `${bot.pair}_${time}.csv`
            if (!fs.existsSync(csvFile)) {
                await binanceBacktestToCSV(bot.pair, time, fromDate, toDate, candleLimit, csvFile)
            } 
            await getBacktestCandlesCSV(bot, csvFile, strategyData, minCandles);
            console.log(`\t ${bot.pair}_${time}.csv --> Benefice: ${bot.benefice}`)
            results[time] = [bot.benefice, bot.prevMoney]
            bot = initBot()
            await sleep(5000)
        }
        console.log(`Benefice: ${JSON.stringify(results)}`)
    } catch (err) {
        console.log("--------------ERROR INIT---------------")
        console.log(err)
    }
}

init()

