const bollinger = require('./../bollinguerBands/strategy.js')
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        bollinger(bot, "boll", 20);

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

