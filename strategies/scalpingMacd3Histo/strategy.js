const ema = require('./../../indicators/ema');
const macd = require('./../../indicators/macd');
const { generateMsg } = require('./../../node/telegramBot');
const { buy, sell } = require('./../../node/paperTrading.js');
const { realBuy, realSell } = require('./../../node/realTrading');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot) {
    
    },

    onCandle: function(bot) {
        ema(bot, "ema9", 9);
        ema(bot, "ema12", 12);
        ema(bot, "ema26", 26);

        macd(bot)

        console.log(`\nTIME: ${bot.actualCandle.time}`);
        if(bot.realTrading) generateMsg(bot.pair, bot.actualCandle.time, "Info", bot.actualCandle.close);

        if(bot.enoughCandles){
            console.log("\nActual Value: " + bot.actualCandle.close)
            console.log("Bot status: " + bot.state)
            console.log("MACD: " + bot.actualCandle.macd)
            console.log("Signal: " + bot.actualCandle.signal)

            let buyValueUp = bot.actualCandle.macd;
            let buyValueDown = bot.actualCandle.signal;

            let sellValueUp = bot.actualCandle.signal;
            let sellValueDown = bot.actualCandle.macd;

            let overZero = false;

            // Histograma mayor que 0 y macd > signal  (1D)
            if (!bot.lookback[0] || bot.lookback[0].ema26 == undefined){
                return; 
            } 

            if (buyValueUp > 0 && buyValueDown > 0) overZero = true;

            if(bot.state === 'initial' || bot.state === 'sell') {
                if (!overZero){
                    return;
                }
                if(buyValueUp > buyValueDown && bot.lookback[0].macd < bot.lookback[0].signal){
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
            else if(bot.state === 'buy' && sellValueUp > sellValueDown){
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