const config = require('./../config.js');
const { sendMsg } = require('./telegramBot');
const retry = require('retry');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

const chatIdError = '-307261607'; // Error

let operation = retry.operation({
    retries: 2,
    factor: 1,
    minTimeout: 60 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
});

// BINANCE API

const binance = require('node-binance-api')().options({
    APIKEY: `${config.apiKey}`,
    APISECRET: `${config.apiSecret}`,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
});

module.exports = {

    realBuy: function(bot) {
        let errorMsg = "";

        binance.marketBuy(`${bot.pair}`, bot.quantity);
        localStorage.setItem(`${bot.pair}_state`, "buy")
        localStorage.setItem(`${bot.pair}_tokensToSell`, `${bot.quantity}`)
        localStorage.setItem(`${bot.pair}_moneyToBuy`, 0)
    },

    realSell: function(bot) {
        let errorMsg = "";

        binance.marketSell(`${bot.pair}`, bot.quantity);
        localStorage.setItem(`${bot.pair}_state`, "sell")
        localStorage.setItem(`${bot.pair}_moneyToBuy`, `${bot.money}`)
        localStorage.setItem(`${bot.pair}_tokensToSell`, 0)
    }
}
