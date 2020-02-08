
module.exports = {

    buy: function(paperTrading, actualPrice) {
        paperTrading.quantity = paperTrading.money / actualPrice;
        paperTrading.money = 0;
    },

    sell: function(paperTrading, actualPrice) {
        paperTrading.money = paperTrading.quantity * actualPrice;
        quantity = 0;
        let benefice = paperTrading.money - paperTrading.initialMoney;
        return (benefice * 100) / paperTrading.initialMoney;
    }
}

