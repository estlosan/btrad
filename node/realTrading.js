const config = require('./../config.js');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// BINANCE API

const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

module.exports = {

    realBuy: function(bot) {
        bot.quantity = bot.money / bot.actualCandle.close;
        bot.money = 0;
    },

    realSell: function(bot) {
        bot.money = bot.quantity * bot.actualCandle.close;
        quantity = 0;
        let benefice = bot.money - bot.tradingMoney;
        return (benefice * 100) / bot.tradingMoney;
    }
}
