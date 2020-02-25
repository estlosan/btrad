const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(lookback, actualCandle, paperTrading) {
    
    },

    onCandle: function(lookback, actualCandle, paperTrading) {

    }
}
