var retry = require('retry');
const { sendMsg, generateMsg } = require('./node/telegramBot');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// BINANCE API


var operation = retry.operation({
    retries: 3,
    factor: 1,
    minTimeout: 60 * 1000,
    maxTimeout: 60 * 1000,
    randomize: true,
  });

const chatIdError = '-307261607'; // Error
const bot = {}
bot.pair = "BTTBNB";
bot.quantity = 314818;
let errorMsg = "";

operation.attempt((attempts) => {
    binance.marketBuy(`${bot.pair}`, bot.quantity, (error, response) => {
        if (attempts  === 4) {
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
            //generateMsg(bot.pair, bot.actualCandle.time, bot.state, bot.actualCandle.close);
            localStorage.setItem(`${bot.pair}_state`, "buy")
            localStorage.setItem(`${bot.pair}_tokensToSell`, `${bot.quantity}`)
            localStorage.setItem(`${bot.pair}_moneyToBuy`, 0)
            console.log("Real BUY\n");
            return;
        }
        const checkStatus = () => {
            //let orderId = response.orderId;
            let orderId = 39811024;
            binance.orderStatus(`${bot.pair}`, orderId, (error, orderStatus, symbol) => {
                if(error){
                    errorMsg = error.body;
                    return operation.retry(error);
                }
                if (orderStatus.status === 'FILLED') {
                    //generateMsg(bot.pair, bot.actualCandle.time, bot.state, bot.actualCandle.close);
                    localStorage.setItem(`${bot.pair}_state`, "buy")
                    localStorage.setItem(`${bot.pair}_tokensToSell`, `${bot.quantity}`)
                    localStorage.setItem(`${bot.pair}_moneyToBuy`, 0)
                    console.log("Real BUY\n");
                    return;
                }
                binance.cancel(`${bot.pair}`, orderId, (error, response, symbol) => {
                    console.log("Cancel response:", response);
                    errorMsg = "Order status not equal: FILLED"
                    return operation.retry(errorMsg);
                });
            });
        }
        setTimeout(checkStatus, 1000 * 30);
    })
});