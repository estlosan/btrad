const ema = require('./../../indicators/ema');
const sma = require('./../../indicators/sma');
const { buy, sell } = require('./../../paperTrading.js');

//  buy(paperTrading, actualCandle.close);
//  sell(paperTrading, actualCandle.close);

module.exports = {

    onRealTime: function(lookback, actualCandle, paperTrading) {

    },

    onCandle: function(lookback, actualCandle, paperTrading) {
        console.log("-----------------INIT DAY---------------")
        var a = new Date(actualCandle.time);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        console.log(time)
        let ema6 = ema(lookback, actualCandle, "ema6", 6);
        let sma38 = sma(lookback, actualCandle, 38);
        let sma100 = sma(lookback, actualCandle, 100);
        console.log("EMA 6: " + ema6);
        console.log("SMA 38: " + sma38);
        console.log("SMA 100: " + sma100);
        if(ema6 > sma38 && lookback[0].sma100 < sma100){
            if(paperTrading.state === 'initial' || paperTrading.state === 'sell') {
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
        console.log("$$$$: " + paperTrading.money)
        console.log("-----------------END DAY---------------")
    }
}