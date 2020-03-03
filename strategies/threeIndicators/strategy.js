const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    },
    
    onCandle: function(bot, paperTrading) {

        ema(bot, "ema6", 6);
        sma(bot, "sma41", 41);
        sma(bot, "sma100", 100);
        sma(bot, "sma21", 21);


        buyUpValue = bot.actualCandle.ema6;
        buyMediumValue = bot.actualCandle.sma41;
        buyDownValue = bot.actualCandle.sma100;

        sellUpValue = bot.actualCandle.sma21;
        sellDownValue = bot.actualCandle.ema6;
        
        if(bot.lookback[0] && bot.lookback[0].sma100){
            if(paperTrading.state === 'buy' && sellUpValue > sellDownValue){
                console.log(`\nTIME: ${bot.actualCandle.time} ------ VENTA`);
                paperTrading.state = 'sell';
                console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close) + "\n");
            } else if((paperTrading.state === 'initial' || paperTrading.state === 'sell') && buyUpValue > buyMediumValue && buyUpValue > buyDownValue && buyMediumValue > buyDownValue){
                if(bot.actualCandle.sma100 > bot.lookback[0].sma100){
                    console.log(`\nTIME: ${bot.actualCandle.time} ------ COMPRA`);
                    paperTrading.state = 'buy';
                    buy(paperTrading, bot.actualCandle.close);
                } 
            }
        }
    }
}
