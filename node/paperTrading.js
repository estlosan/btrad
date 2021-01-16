fs = require('fs');

module.exports = {

    buy: function(bot) {
        bot.quantity = bot.money / bot.actualCandle.close;
        bot.prevMoney = bot.money
        bot.money = 0;
    },

    sell: function(bot) {
        bot.money = bot.quantity * bot.actualCandle.close;
        bot.quantity = 0;
        let trxBenefice = bot.money - bot.prevMoney;
        let trxBeneficePerc = (trxBenefice * 100) / bot.prevMoney
        fs.appendFile('./trxInfo.txt', `${bot.actualCandle.time} Benefice: ${trxBeneficePerc}\n`, function (err) {
            if (err) console.log("Error writing trxInfo file");
        });
        let benefice = bot.money - bot.tradingMoney;
        return (benefice * 100) / bot.tradingMoney;
    }
}

