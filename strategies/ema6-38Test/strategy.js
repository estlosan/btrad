const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
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
        sma(bot, "sma38", 38);
        sma(bot, "sma100", 100);

        console.log(`\nTIME: ${bot.actualCandle.time} \n`);

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("EMA 6: " + bot.actualCandle.ema6)
            console.log("EMA 21: " + bot.actualCandle.sma38)
            console.log("EMA 21: " + bot.actualCandle.sma100)
            console.log("\n")


            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].sma100 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {

                if( !(bot.actualCandle.sma100 > bot.lookback[0].sma100) ) {
                    return;
                }
                if(bot.actualCandle.ema6 > bot.actualCandle.sma38){
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA \n`);
                    if(bot.realTrading){
                        generateMsg(bot.pair, bot.actualCandle.time, "preOrder", bot.actualCandle.close);
                        realBuy(bot)
                    } 
                    else {
                        bot.state = 'buy';
                        buy(bot);
                    }
                }
            }
            else if(bot.state === 'buy' && bot.actualCandle.ema6 < bot.actualCandle.sma38){
                console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                if(bot.realTrading){
                    generateMsg(bot.pair, bot.actualCandle.time, "preOrder", bot.actualCandle.close);
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

