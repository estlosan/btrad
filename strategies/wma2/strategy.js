const wma = require('./../../indicators/wma.js');
const macd = require('./../../indicators/macd.js');
const sma = require('./../../indicators/sma.js');
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
        ema(bot, "ema12", 38);
        ema(bot, "ema26", 70);
        wma(bot, "wma", 6);
        sma(bot, "sma21", 21);
        sma(bot, "sma", 6);
        macd(bot);

        

        if(bot.enoughCandles){

            generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

            /* let percentage = bot.buyPrice != 0 ? ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100 : 0
            if(percentage >= bot.takeProfit || percentage <= bot.stopLoss ){
                sell(bot)
            }  */
            if (
                bot.actualCandle.wma < bot.actualCandle.sma 
            ) {
                sell(bot)
            }
            else if(bot.lookback[0].sma21 < bot.actualCandle.sma21
                && bot.lookback[0].wma < bot.lookback[0].sma
                && bot.actualCandle.wma > bot.actualCandle.sma
                && bot.actualCandle.histogram > 0
            ) {
                buy(bot)
            }
        }
    } 
}

