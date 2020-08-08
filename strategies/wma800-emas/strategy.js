const ema = require('../../indicators/ema');
const wma = require('../../indicators/wma');
const { generateMsg } = require('../../node/telegramBot');
const { buy, sell } = require('../../node/paperTrading.js');
const { realBuy, realSell } = require('../../node/realTrading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        ema(bot, "ema50", 50);
        wma(bot, "wma200", 200);


        console.log("\nTIME: " + bot.actualCandle.time)

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("EMA 50: " + bot.actualCandle.ema50)
            console.log("WMA 200: " + bot.actualCandle.wma200 + "\n")

            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].wma200 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {
                if(bot.lookback[0].ema50 < bot.lookback[0].wma200 && bot.actualCandle.ema50 > bot.actualCandle.wma200){
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
            else if(bot.state === 'buy' && bot.actualCandle.ema50 < bot.actualCandle.wma200){
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

