const atr = require('./../../indicators/atr.js');
const ssma = require('./../../indicators/ssma.js');
const wma = require('./../../indicators/wma.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        ssma(bot, "ssma", 4);
        
       

        if(bot.enoughCandles){

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            console.log(bot.actualCandle.close)
            console.log(bot.actualCandle.ssma)
            if(
                bot.actualCandle.close < bot.actualCandle.ssma
            ) {
                sell(bot);
            }
            else if(
                bot.actualCandle.close > bot.actualCandle.ssma
            ) {
                buy(bot)
            }
        }
    } 
}

