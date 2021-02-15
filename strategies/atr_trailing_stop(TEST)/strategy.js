const atr = require('./../../indicators/atr.js');
const macd = require('./../../indicators/macd_custom.js');
const ema = require('./../../indicators/ema.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        atr(bot, "atr", 5, 10, 2.5);
        ema(bot, "ema12", 12);
        ema(bot, "ema38", 38);
        ema(bot, "ema70", 70);
        macd(bot);
       
        if(bot.enoughCandles){

            generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            if(
                bot.lookback[0].close > bot.lookback[0].atr_trail_stop && 
                bot.actualCandle.close < bot.actualCandle.atr_trail_stop
            ) {
                sell(bot);
            }

            else if(
                bot.lookback[0].macd < bot.lookback[0].signal &&
                bot.actualCandle.macd > bot.actualCandle.signal
            ) {
                buy(bot)
            }
/*             else if(
                ! (bot.lookback[0].ema9 > bot.lookback[0].ema13 && 
                bot.lookback[0].ema9 > bot.lookback[0].ema21 && 
                bot.lookback[0].ema9 > bot.lookback[0].ema55 && 
                bot.lookback[0].ema13 > bot.lookback[0].ema21 && 
                bot.lookback[0].ema13 > bot.lookback[0].ema55 && 
                bot.lookback[0].ema21 > bot.lookback[0].ema55)
                
            ) {
                if(
                    bot.actualCandle.ema9 > bot.actualCandle.ema13 && 
                    bot.actualCandle.ema9 > bot.actualCandle.ema21 && 
                    bot.actualCandle.ema9 > bot.actualCandle.ema55 && 
                    bot.actualCandle.ema13 > bot.actualCandle.ema21 && 
                    bot.actualCandle.ema13 > bot.actualCandle.ema55 && 
                    bot.actualCandle.ema21 > bot.actualCandle.ema55
                ) {
                    buy(bot)
                }
            } */
        }
    } 
}

