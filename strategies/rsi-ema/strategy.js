const rsi = require('./../../indicators/rsi.js');
const ema = require('./../../indicators/ema.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        rsi(bot, "rsi14", 14);
        ema(bot, "ema660", 660);
        
       

        if(bot.enoughCandles){

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            if(
                bot.actualCandle.rsi14 > 70
            ) {
                sell(bot);
            }
            else if(
                bot.actualCandle.rsi14 < 30 &&
                bot.actualCandle.close > bot.actualCandle.ema660 
            ) {
                buy(bot)
            }
        }
    } 
}

