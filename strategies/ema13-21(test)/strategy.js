const vwap = require('./../../indicators/vwap.js');
const ema = require('./../../indicators/ema.js');
const sma = require('./../../indicators/sma.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        sma(bot, "smaVol", 10, "volume");
        ema(bot, "ema13", 13);
        ema(bot, "ema34", 34);

               
        if(bot.enoughCandles){

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            
            if(
                bot.lookback[0].ema13 > bot.lookback[0].ema34 &&
                bot.actualCandle.ema13 < bot.actualCandle.ema34
            ){
                sell(bot)
            }   
            else if(
                bot.lookback[0].ema13 < bot.lookback[0].ema34 &&
                bot.actualCandle.ema13 > bot.actualCandle.ema34 &&
                bot.actualCandle.volume > bot.actualCandle.smaVol 
            ) {
                buy(bot)
            }
        }
    } 
}

