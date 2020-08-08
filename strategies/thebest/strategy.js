const wma = require('./../../indicators/wma');
const rsi = require('./../../indicators/rsi');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/paperTrading.js');
const { realBuy, realSell } = require('./../../node/realTrading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        rsi(bot, "rsi9", 9);
        wma(bot, "wma50", 50);

        console.log(`\nTIME: ${bot.actualCandle.time} \n`);

        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("WMA100: " + bot.actualCandle.wma50)
            console.log("RSI 9: " + bot.actualCandle.rsi9 + "\n")


            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].wma50 == undefined){
                return; 
            } 

            if(bot.state === 'initial' || bot.state === 'sell') {
                if(bot.actualCandle.close > bot.actualCandle.wma50 && bot.actualCandle.close < bot.lookback[0].wma50){
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
            else if(bot.state === 'buy' && bot.actualCandle.close < bot.actualCandle.wma50){
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

