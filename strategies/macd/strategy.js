const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const macd = require('./../../indicators/macd');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(bot, paperTrading) {
    
    },

    onCandle: function(bot, paperTrading) {
        ema(bot, "ema9", 9);
        ema(bot, "ema12", 12);
        ema(bot, "ema26", 26);
        
        macd(bot);
        // Histograma mayior que 0 y macd > signal  (1D)

        if(bot.actualCandle.macd && bot.actualCandle.signal){
            if(bot.actualCandle.macd > 0 && bot.actualCandle.signal > 0){
                bot.actualCandle.macdState = "up";
            } else {
                bot.actualCandle.macdState = "down";
            }

            if(bot.actualCandle.macd > bot.actualCandle.signal){
                if(bot.lookback[0].macd < bot.lookback[0].signal){
                    if(bot.actualCandle.macdState === "up"){
                        if(paperTrading.state === 'initial' || paperTrading.state === 'sell') {
                            console.log("COMPROOOOOOOooo");
                            console.log(bot.actualCandle.time);
                            paperTrading.state = 'buy';
                            buy(paperTrading, bot.actualCandle.close);
                        }
                    } else if(paperTrading.state === 'buy'){
                        console.log("VENDOOO")
                        console.log(bot.actualCandle.time);
                        paperTrading.state = 'sell';
                        console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close));
                    }
                }
                 
            }
            else if(paperTrading.state === 'buy'){
                console.log("VENDOOO")
                console.log(bot.actualCandle.time);
                paperTrading.state = 'sell';
                console.log("BENEFICIO: " + sell(paperTrading, bot.actualCandle.close));
            }
        }

       /*  if(bot.actualCandle.ema9 > bot.actualCandle.sma30 && bot.actualCandle.ema9 > bot.actualCandle.sma80 && bot.actualCandle.sma30 > bot.actualCandle.sma80){
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
    }
}