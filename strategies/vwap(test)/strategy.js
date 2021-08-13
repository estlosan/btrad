const vwap = require('./../../indicators/vwap.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');


module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        vwap(bot, "vwap");
        
       
        if(bot.enoughCandles){

            generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            let percentage = bot.buyPrice != 0 ? ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100 : 0
            if(percentage >= bot.takeProfit || percentage <= bot.stopLoss ){
                sell(bot)
            }   
            else if(
                bot.actualCandle.close < bot.lookback[0].vwap &&
                bot.actualCandle.close > bot.actualCandle.vwap
            ) {
                buy(bot)
            }
        }
    } 
}

