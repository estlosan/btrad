module.exports = function ssma (bot, key, length, source_key) {
    let auxLookback = bot.lookback.slice();
    auxLookback.unshift(bot.actualCandle);
    if (!source_key) source_key = 'close'
    if (bot.lookback.length >= length) {
        let prev_ssma = bot.lookback[0][key];
        if (typeof prev_ssma === 'undefined' || isNaN(prev_ssma)) {
            let SMA = auxLookback
                .slice(0, length)
                .reduce((sum, candle) => {
                return sum + candle["close"]
                }, 0)
            bot.actualCandle[key] = SMA / length
        }
        else {
            let prev_sum = prev_ssma * length;
            bot.actualCandle[key] = (prev_sum - prev_ssma + bot.actualCandle.close) / length;
        }
    }
  }
  
  