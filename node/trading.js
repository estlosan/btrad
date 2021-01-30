fs = require('fs');
const config = require('./../config.js');
const { generateMsg, sendMsg } = require('./telegramBot');
const retry = require('retry');

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

const chatIdError = '-307261607'; // Error

let operation = retry.operation({
    retries: 2,
    factor: 1,
    minTimeout: 10 * 1000,
    maxTimeout: 10 * 1000,
    randomize: true,
});

module.exports = {

    buy: function(bot) {
        if(bot.state == 'buy'){
            return;
        }
        if(bot.realTime){
            console.log("DANGER_______________________REAL BUY______________________")
            let quantityToBuy = bot.money / bot.actualCandle.close;
            let quantityToBuyFixed = parseFloat(quantityToBuy).toFixed(bot.minQty)
            let errorMsg = "MSG: ";
            operation.attempt((attempts) => {
                binance.marketBuy(`${bot.pair}`, quantityToBuyFixed, (error, response) => {
                    if (attempts  === 3) {
                        sendMsg(chatIdError, `${bot.pair} Posible Error: Attempts = 3`)
                        sendMsg(chatIdError, `${errorMsg}`);
                        console.log(errorMsg);
                        return;
                    }
                    if(error){
                        errorMsg = error.body;
                        return operation.retry(error);
                    }
                    if(response.status === 'FILLED'){
                        bot.quantity = quantityToBuyFixed;
                        bot.money = 0;
                        bot.state = 'buy'
                        localStorage.setItem(`${bot.pair}_state`, "buy")
                        localStorage.setItem(`${bot.pair}_tokensToSell`, `${bot.quantity}`)
                        localStorage.setItem(`${bot.pair}_moneyToBuy`, 0)
                        console.log("Real BUY\n");
                        generateMsg(bot.pair, bot.actualCandle.time, bot.state, response.status, bot.actualCandle.close);
                        return;
                    }
                    const checkStatus = () => {
                        let orderId = response.orderId;
                        binance.orderStatus(`${bot.pair}`, orderId, (error, orderStatus, symbol) => {
                            if(error){
                                errorMsg = error.body;
                                return operation.retry(error);
                            }
                            if (orderStatus.status === 'FILLED' || orderStatus.status === 'PARTIALLY_FILLED') {
                                bot.quantity = quantityToBuyFixed;
                                bot.money = 0;
                                bot.state = 'buy'
                                localStorage.setItem(`${bot.pair}_state`, "buy")
                                localStorage.setItem(`${bot.pair}_tokensToSell`, `${bot.quantity}`)
                                localStorage.setItem(`${bot.pair}_moneyToBuy`, 0)
                                console.log("Real BUY\n");
                                generateMsg(bot.pair, bot.actualCandle.time, bot.state, response.status, bot.actualCandle.close);
                                return;
                            }
                            binance.cancel(`${bot.pair}`, orderId, (error, response, symbol) => {
                                console.log("Cancel response:", response);
                                errorMsg = "Order status not equal: FILLED"
                                return operation.retry(errorMsg);
                            });
                        });
                    }
                    setTimeout(checkStatus, 1 * 60 * 1000);
                })
            });
        }
        else {
            bot.state = 'buy'
            generateMsg(bot.pair, bot.actualCandle.time, bot.state, "FILLED", bot.actualCandle.close);
            bot.quantity = bot.money / bot.actualCandle.close;
            bot.prevMoney = bot.money
            bot.buyPrice = bot.actualCandle.close;
            bot.money = 0;
        }
    },

    sell: function(bot) {
        if(bot.state == 'sell'){
            return;
        }
        if(bot.realTime){
            console.log("DANGER_______________________REAL SELL______________________")
            let errorMsg = "MSG: ";
            operation.attempt((attempts) => {
                binance.marketSell(`${bot.pair}`, bot.quantity, (error, response) => {
                    if (attempts  === 3) {
                        sendMsg(chatIdError, `${bot.pair} Posible Error: Attempts = 3`)
                        sendMsg(chatIdError, `${errorMsg}`);
                        console.log(errorMsg);
                        return;
                    }
                    if(error){
                        errorMsg = error.body;
                        console.log(errorMsg)
                        return operation.retry(error);
                    }
                    if(response.status === 'FILLED'){
                        bot.money = bot.quantity * bot.actualCandle.close;
                        bot.quantity = 0;
                        bot.state = 'sell'
                        let benefice = bot.money - bot.tradingMoney;
                        let beneficePercent = (benefice * 100) / bot.tradingMoney;
                        localStorage.setItem(`${bot.pair}_state`, "sell")
                        localStorage.setItem(`${bot.pair}_moneyToBuy`, `${bot.money}`)
                        localStorage.setItem(`${bot.pair}_tokensToSell`, 0)
                        console.log("Real SELL\n");
                        generateMsg(bot.pair, bot.actualCandle.time, bot.state, response.status, bot.actualCandle.close, beneficePercent);
                        return;
                    }
                    const checkStatus = () => {
                        let orderId = response.orderId;
                        binance.orderStatus(`${bot.pair}`, orderId, (error, orderStatus, symbol) => {
                            if(error){
                                errorMsg = error.body;
                                console.log(errorMsg)
                                return operation.retry(error);
                            }
                            if (orderStatus.status === 'FILLED' || orderStatus.status === 'PARTIALLY_FILLED') {
                                bot.money = bot.quantity * bot.actualCandle.close;
                                bot.quantity = 0;
                                bot.state = 'sell'
                                let benefice = bot.money - bot.tradingMoney;
                                let beneficePercent = (benefice * 100) / bot.tradingMoney;
                                localStorage.setItem(`${bot.pair}_state`, "sell")
                                localStorage.setItem(`${bot.pair}_moneyToBuy`, `${bot.money}`)
                                localStorage.setItem(`${bot.pair}_tokensToSell`, 0)
                                console.log("Real SELL\n");
                                generateMsg(bot.pair, bot.actualCandle.time, bot.state, response.status, bot.actualCandle.close, beneficePercent);
                                return;
                            }
                            binance.cancel(`${bot.pair}`, orderId, (error, response, symbol) => {
                                console.log("Cancel response:", response);
                                errorMsg = "Order status not equal: FILLED"
                                return operation.retry(errorMsg);
                            });
                        });
                    }
                    setTimeout(checkStatus, 1 * 60 * 1000);
                })
            });
        }
        else {
            bot.state = "sell"
            let beneficePercent = ((bot.actualCandle.close - bot.buyPrice) / bot.buyPrice) * 100;
            generateMsg(bot.pair, bot.actualCandle.time, bot.state, "FILLED", bot.actualCandle.close, beneficePercent);
            bot.money = bot.quantity * bot.actualCandle.close;
            bot.quantity = 0;
            bot.buyPrice = 0;
            let trxBenefice = bot.money - bot.prevMoney;
            let trxBeneficePerc = (trxBenefice * 100) / bot.prevMoney
            fs.appendFile('./trxInfo.txt', `${bot.actualCandle.time} Benefice: ${trxBeneficePerc}\n`, function (err) {
                if (err) console.log("Error writing trxInfo file");
            });
            bot.benefice += beneficePercent
        }
    }
}