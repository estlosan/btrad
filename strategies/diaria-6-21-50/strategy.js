const ema = require('./../../indicators/ema');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    
    },

    onCandle: function(bot, paperTrading) {
        ema(bot, "ema6", 6);
        ema(bot, "ema21", 21);
        ema(bot, "ema50", 50);

        if(bot.telegramAlert) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            let buyValueUp = bot.actualCandle.ema6;
            let buyValueMiddle = bot.actualCandle.ema21;
            let buyValueDown = bot.actualCandle.ema50;

            let sellValueUp = bot.actualCandle.ema21;
            let sellValueDown = bot.actualCandle.ema6;

            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].ema50 == undefined){
                return; 
            } 

            if(paperTrading.state === 'initial' || paperTrading.state === 'sell') {
                if( !(bot.actualCandle.ema50 > bot.lookback[0].ema50) ) {
                    return;
                }
                if(buyValueUp > buyValueMiddle && buyValueMiddle > buyValueDown){
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA \n`);
                    paperTrading.state = 'buy';
                    buy(paperTrading, bot.actualCandle.close);
                    if(bot.telegramAlert){
                        generateMsg(bot.pair, bot.actualCandle.time, paperTrading.state, bot.actualCandle.close);
                    }
                }
            }
            else if(paperTrading.state === 'buy' && sellValueUp > sellValueDown){
                console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                paperTrading.state = 'sell';
                let benefice = sell(paperTrading, bot.actualCandle.close); 
                console.log("BENEFICIO: " + benefice + "\n");
                if(bot.telegramAlert){
                    generateMsg(bot.pair, bot.actualCandle.time, paperTrading.state, bot.actualCandle.close, benefice);
                }
            }
        }
    } 
}

