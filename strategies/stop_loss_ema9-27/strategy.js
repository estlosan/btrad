const ema = require('./../../indicators/ema.js');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {

        ema(bot, "ema9", 9);
        ema(bot, "ema27", 27);

        generateMsg(bot, bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){

            let percentage = bot.buyPrice != 0 ? ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100 : 0
            if(percentage >= bot.takeProfit || percentage <= bot.stopLoss ){
                sell(bot)
            }            

            if(
                bot.lookback[0].ema9 < bot.lookback[0].ema27 &&
                bot.actualCandle.ema9 > bot.actualCandle.ema27
            ){
                buy(bot)
            }
        }
    } 
}

