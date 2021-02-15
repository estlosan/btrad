const atr = require('./../../indicators/atr.js');
const ema = require('./../../indicators/ema.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        atr(bot, "atr", 5, 10, 2.5);
        ema(bot, "ema6", 6);
        ema(bot, "ema21", 21);
        ema(bot, "ema50", 50);
        
        

        if(bot.enoughCandles){

            generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            if(
                bot.lookback[0].close > bot.lookback[0].atr_trail_stop && 
                bot.actualCandle.close < bot.actualCandle.atr_trail_stop
            ) {
                sell(bot);
            }
            else if(
                (bot.lookback[0].ema6 < bot.lookback[0].ema21 ||
                bot.lookback[0].ema6 < bot.lookback[0].ema50) &&
                bot.actualCandle.ema6 > bot.actualCandle.ema21 &&
                bot.actualCandle.ema6 > bot.actualCandle.ema50 &&
                bot.actualCandle.ema21 > bot.actualCandle.ema50
            ) {
                buy(bot)
            }
        }
    } 
}

