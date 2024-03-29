const heikinAshi = require('./../../indicators/heikinAshi.js');
const rsi_heikin = require('./../../indicators/rsi_heikin.js')
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/trading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        heikinAshi(bot, 'heikinAshi');
        rsi_heikin(bot, "rsi_heikin", 14);

        generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){

            let percentage = bot.buyPrice != 0 ? ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100 : 0
            if(percentage >= bot.takeProfit || percentage <= bot.stopLoss ){
                sell(bot)
            }
            else if(bot.lookback[0].rsi_heikin < 50 && bot.actualCandle.rsi_heikin >= 50){
                if(
                    bot.lookback[0].heikinAshi.close > bot.lookback[0].heikinAshi.open &&
                    bot.lookback[1].heikinAshi.close > bot.lookback[1].heikinAshi.open
                ) {
                    buy(bot);
                }
            }
            
        }
    } 
}

