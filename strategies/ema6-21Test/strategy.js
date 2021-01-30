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
        sma(bot, "sma21", 21);

        console.log(`\nTIME: ${bot.actualCandle.time} \n`);

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("EMA 6: " + bot.actualCandle.ema6)
            console.log("EMA 21: " + bot.actualCandle.sma21)
            console.log("\n")


            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].sma21 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {

                if( !(bot.actualCandle.ema6 > bot.lookback[0].ema6) ) {
                    return;
                }
                if( !(bot.actualCandle.sma21 > bot.lookback[0].sma21) ) {
                    return;
                }
                if(bot.lookback[0].ema6 < bot.lookback[0].sma21 && bot.actualCandle.ema6 > bot.actualCandle.sma21){
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
            else if(bot.state === 'buy' && bot.actualCandle.ema6 < bot.actualCandle.sma21){
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
