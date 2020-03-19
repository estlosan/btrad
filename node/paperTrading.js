
module.exports = {

    buy: function(bot) {
        bot.quantity = bot.money / bot.actualCandle.close;
        bot.money = 0;
    },

    sell: function(bot) {
        bot.money = bot.quantity * bot.actualCandle.close;
        bot.quantity = 0;
        let benefice = bot.money - bot.tradingMoney;
        return (benefice * 100) / bot.tradingMoney;
    }
}

