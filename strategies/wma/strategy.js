const wma = require('./../../indicators/wma.js');
const rsi = require('./../../indicators/rsi.js');
const sma = require('./../../indicators/sma.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        wma(bot, "wma25", 25);
        wma(bot, "wma21", 21);
        rsi(bot, "rsi", 14);
        sma(bot, "sma", 50);

        generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){

            /* let percentage = bot.buyPrice != 0 ? ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100 : 0
            if(percentage >= bot.takeProfit || percentage <= bot.stopLoss ){
                sell(bot)
            }  */
            if (
                bot.actualCandle.close < bot.actualCandle.wma25
            ) {
                sell(bot)
            }
            else if(bot.lookback[0].wma21 < bot.actualCandle.wma21
                && bot.actualCandle.rsi > 50
            ) {
                buy(bot)
            }
        }
    } 
}

