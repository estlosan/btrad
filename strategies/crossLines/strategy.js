const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
        /* let ema9 = ema(lookback, actualCandle, "ema9", 9);
        console.log("EMA: " + ema9)
        let sma30 = sma(lookback, actualCandle, 30);
        console.log("SMA: " + sma30)
        let sma80 = sma(lookback, actualCandle, 80)

        if(ema9 > sma30 && ema9 > sma80 && sma30 > sma80){
            if(paperTrading.state === 'initial' || paperTrading === 'sell') {
                console.log("COMPROOOO");
                paperTrading.state = 'buy';
                buy(paperTrading, actualCandle.close);
            }
        }
        else if(paperTrading.state === 'buy'){
                console.log("VENDOOO")
                paperTrading.state = 'sell';
                console.log("BENEFICIO: " + sell(paperTrading, actualCandle.close));
        } */

        //console.log('SMA:' + sma(lookback, actualCandle, 2,"close"));
    },
    
    onCandle: function(bot, paperTrading) {
/*         ema(bot, "ema9", 9);
        sma(bot, "sma30", 30);
        sma(bot, "sma80", 80)

        if(bot.actualCandle.ema9 > bot.actualCandle.sma30 && bot.actualCandle.ema9 > bot.actualCandle.sma80 && bot.actualCandle.sma30 > bot.actualCandle.sma80){
            if(paperTrading.state === 'initial' || paperTrading === 'sell') {
                console.log("COMPROOOO");
                paperTrading.state = 'buy';
                buy(paperTrading, bot.actualCandle.close);
            }
        }
        else if(paperTrading.state === 'buy'){
            console.log("VENDOOO")
            paperTrading.state = 'sell';
            console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close));
        } */
        ema(bot, "ema6", 6);
        sma(bot, "sma41", 41);
        sma(bot, "sma100", 100);
        sma(bot, "sma21", 21);
        
        if(bot.actualCandle.sma100){

            if(paperTrading.state === 'buy' && bot.actualCandle.ema6 < bot.actualCandle.sma21){
                console.log("VENDOOO")
                console.log(bot.actualCandle.time)
                paperTrading.state = 'sell';
                console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close));
            } else if((paperTrading.state === 'initial' || paperTrading.state === 'sell') && bot.actualCandle.ema6 > bot.actualCandle.sma41 && bot.actualCandle.ema6 > bot.actualCandle.sma100 && bot.actualCandle.sma41 > bot.actualCandle.sma100){
                if(bot.actualCandle.sma100 > bot.lookback[0].sma100){
                    console.log("COMPROOOO");
                    console.log(bot.actualCandle.time)
                    paperTrading.state = 'buy';
                    buy(paperTrading, bot.actualCandle.close);
                } 
            }
        }


/*         if(bot.actualCandle.sma100){

            if(paperTrading.state === 'buy' && bot.actualCandle.ema6 < bot.actualCandle.sma21){
                if(bot.lookback[0].ema6 > bot.lookback[0].sma21){
                    console.log(bot.actualCandle.ema6)
                    console.log(bot.actualCandle.sma21)
                    console.log("VENDOOO")
                    console.log(bot.actualCandle.time)
                    paperTrading.state = 'sell';
                    console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close));
                }
            } else if((paperTrading.state === 'initial' || paperTrading.state === 'sell') && bot.actualCandle.ema6 > bot.actualCandle.sma41 && bot.actualCandle.ema6 > bot.actualCandle.sma100 && bot.actualCandle.sma41 > bot.actualCandle.sma100){
                if(bot.lookback[0].ema6 < bot.lookback[0].sma41){
                    if(bot.actualCandle.sma100 > bot.lookback[0].sma100){
                        console.log("COMPROOOO");
                        console.log(bot.actualCandle.time)
                        paperTrading.state = 'buy';
                        buy(paperTrading, bot.actualCandle.close);
                    } 
                }
            }
        } */
    }
}
