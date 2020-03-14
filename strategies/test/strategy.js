const ema = require('./../../indicators/ema');
const sendMsg = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    
    },

    onCandle: function(bot, paperTrading) {
        ema(bot, "ema12", 12);
        ema(bot, "ema26", 26);
        ema(bot, "ema50", 50);

        console.log("\n\nCLOSE " + bot.actualCandle.close)
        console.log("\n\nEMA12: " + bot.actualCandle.ema12)
        console.log("EMA26: " + bot.actualCandle.ema26)
        console.log("EMA50: " + bot.actualCandle.ema50+ "\n\n")
    } 
}

