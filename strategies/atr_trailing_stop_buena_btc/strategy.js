const atr = require('./../../indicators/atr.js');
const ssma = require('./../../indicators/ssma.js');
const wma = require('./../../indicators/wma.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        atr(bot, "atr", 5, 10, 2.5);
        ssma(bot, "ssma", 4);
        wma(bot, "wma", 144);
        
       

        if(bot.actualCandle.time == "14 Feb 2018 9:0:0"){
            console.log("E")
        }

        if(bot.enoughCandles){

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            if(
                bot.lookback[0].close > bot.lookback[0].atr_trail_stop && 
                bot.actualCandle.close < bot.actualCandle.atr_trail_stop
            ) {
                sell(bot);
            }
            else if(
                bot.lookback[0].ssma < bot.lookback[0].wma &&
                bot.actualCandle.ssma > bot.actualCandle.wma
            ) {
                buy(bot)
            }
        }
    } 
}

