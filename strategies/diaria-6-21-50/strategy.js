const ema = require('./../../indicators/ema');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/paperTrading.js');
const { realBuy, realSell } = require('./../../node/realTrading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        ema(bot, "ema6", 6);
        ema(bot, "ema21", 21);
        ema(bot, "ema50", 50);

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("EMA 6: " + bot.actualCandle.ema6)
            console.log("EMA 21: " + bot.actualCandle.ema21)
            console.log("EMA 50: " + bot.actualCandle.ema50 + "\n")

            let buyValueUp = bot.actualCandle.ema6;
            let buyValueMiddle = bot.actualCandle.ema21;
            let buyValueDown = bot.actualCandle.ema50;

            let sellValueUp = bot.actualCandle.ema21;
            let sellValueDown = bot.actualCandle.ema6;

            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].ema50 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {
                if( !(bot.actualCandle.ema50 > bot.lookback[0].ema50) ) {
                    return;
                }
                if(buyValueUp > buyValueMiddle && buyValueMiddle > buyValueDown){
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA \n`);
                    if(bot.realTrading){
                        realBuy(bot)
                    } 
                    else {
                        bot.state = 'buy';
                        buy(bot);
                    }
                }
            }
            else if(bot.state === 'buy' && sellValueUp > sellValueDown){
                console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                if(bot.realTrading){
                    realSell(bot)
                }
                else {
                    bot.state = 'sell';
                    let benefice = sell(bot); 
                    console.log("BENEFICIO: " + benefice + "\n");
                }
            }
        }
    } 
}

