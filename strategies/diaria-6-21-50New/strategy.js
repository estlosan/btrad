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

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            if(
                bot.actualCandle.ema6 < bot.actualCandle.ema21 ||
                bot.actualCandle.ema6 < bot.actualCandle.ema50 ||
                bot.actualCandle.ema21 < bot.actualCandle.ema50
            ) {
                sell(bot);
            }
            else if(
                bot.actualCandle.ema6 > bot.actualCandle.ema21 &&
                bot.actualCandle.ema6 > bot.actualCandle.ema50 &&
                bot.actualCandle.ema21 > bot.actualCandle.ema50
            ) {
                buy(bot)
            }
        }
    } 
}

