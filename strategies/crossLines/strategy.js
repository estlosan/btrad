const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(lookback, actualCandle, paperTrading) {
        let ema9 = ema(lookback, actualCandle, "ema9", 9);
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
        }

        //console.log('SMA:' + sma(lookback, actualCandle, 2,"close"));
    },

    onCandle: function() {

    }
}
