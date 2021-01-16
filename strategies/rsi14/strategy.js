
const rsi = require('./../../indicators/rsi');
const { buy, sell } = require('./../../node/paperTrading.js');
const sendMsg = require('./../../node/telegramBot.js')

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    
    },

    onCandle: function(bot, paperTrading) {
        rsi(bot, "rsi14", 14);

        if(bot.lookback[0] && bot.lookback[0].rsi14 != undefined){
            if(bot.actualCandle.rsi14 < 30){
                if(paperTrading.state === 'initial' || paperTrading.state === 'sell') {
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA \n`);
                    paperTrading.state = 'buy';
                    buy(paperTrading, bot.actualCandle.close);
                    sendMsg("");
                }
            }
            else {
                bot.actualCandle.stopTrading = bot.actualCandle.close * 0,05;
                if(bot.actualCandle.close < bot.lookback[0].stopTrading){
                    if(paperTrading.state === 'buy'){
                        console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                        paperTrading.state = 'sell';
                        console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close) + "\n");
                    }
                }
            }
        }
    }
}

