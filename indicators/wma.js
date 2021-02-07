module.exports = function wma (bot, key, length, source_key) {
    let auxLookback = bot.lookback.slice();
    auxLookback.unshift(bot.actualCandle);
    if (!source_key) source_key = 'close'
    if (bot.lookback.length >= length) {
        let counter = length;
        let lengthSum = 0;
        let WMA = auxLookback
            .slice(0, length)
            .reduce((sum, candle) => {
                let result = sum + candle["close"] * counter;
                lengthSum += counter;
                counter --;
                return result;
            }, 0)
        
        bot.actualCandle[key] = WMA / lengthSum
    }
}