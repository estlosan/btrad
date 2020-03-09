module.exports = function rsi (bot, key, length, source_key) {
    if(!bot.lookback[0]) return;
    bot.actualCandle.dif = bot.actualCandle.close - bot.lookback[0].close;
    if(bot.actualCandle.dif > 0){
        bot.actualCandle.up = bot.actualCandle.dif;
        bot.actualCandle.down = 0;
    } else{
        bot.actualCandle.down = Math.abs(bot.actualCandle.dif);
        bot.actualCandle.up = 0;
    }
    let auxLookback = bot.lookback.slice();
    auxLookback.unshift(bot.actualCandle);
    if (!source_key) source_key = 'close'
    if (bot.lookback.length >= length) {
        let smaGain = auxLookback
        .slice(0, length)
        .reduce((sum, candle) => {
            return sum + candle.up
        }, 0)
        let smaLoss = auxLookback
        .slice(0, length)
        .reduce((sum, candle) => {
            return sum + candle.down
        }, 0)
        bot.actualCandle.avGain = smaGain / length
        bot.actualCandle.avLoss = smaLoss / length
        bot.actualCandle.rs = bot.actualCandle.avGain / bot.actualCandle.avLoss
        if(bot.actualCandle.rs != 0) bot.actualCandle[key] = 100 - (100 / (1 + bot.actualCandle.rs))
    }
}