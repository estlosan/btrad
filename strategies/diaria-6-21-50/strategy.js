const ema = require('./../../indicators/ema');
const bot = require('./../../node/telegramBot');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    
    },

    onCandle: function(bot, paperTrading) {
        ema(bot, "ema6", 6);
        ema(bot, "ema14", 14);
        ema(bot, "ema21", 21);
        ema(bot, "ema50", 50);

        let buyValueUp = bot.actualCandle.ema6;
        let buyValueDown = bot.actualCandle.ema21;

        let sellValueUp = bot.actualCandle.ema21;
        let sellValueDown = bot.actualCandle.ema6;

        // Histograma mayior que 0 y macd > signal  (1D)
        if (bot.lookback[0] && bot.lookback[0].ema50 != undefined){
            if(bot.actualCandle.ema50 > bot.lookback[0].ema50) {    
                if(paperTrading.state === 'buy' && sellValueUp > sellValueDown){
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                    paperTrading.state = 'sell';
                    console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close) + "\n");
                } 
                else if(buyValueUp > buyValueDown){
                    if(paperTrading.state === 'initial' || paperTrading.state === 'sell') {
                        console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA \n`);
                        paperTrading.state = 'buy';
                        buy(paperTrading, bot.actualCandle.close);
                    }
                }
            } 
            else if(paperTrading.state === 'buy' && sellValueUp > sellValueDown){
                console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                paperTrading.state = 'sell';
                console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close) + "\n");
            } 
        } 
    }
}

