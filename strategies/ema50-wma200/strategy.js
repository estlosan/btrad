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
        ema(bot, "ema21", 21);
        ema(bot, "ema80", 80);
        wma(bot, "wma800", 800);


        console.log("\nTIME: " + bot.actualCandle.time)

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("EMA 21: " + bot.actualCandle.ema21)
            console.log("EMA 80: " + bot.actualCandle.ema80)
            console.log("WMA 800: " + bot.actualCandle.wma800 + "\n")

            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].wma800 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {
                if(bot.lookback[0].close < bot.lookback[0].wma800 && bot.actualCandle.close > bot.actualCandle.wma800){
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
            else if(bot.state === 'buy' && bot.actualCandle.ema21 < bot.actualCandle.ema80){
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

