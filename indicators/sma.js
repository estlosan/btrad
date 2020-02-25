module.exports = function sma (bot, key, length, source_key) {
  let auxLookback = bot.lookback.slice();
  auxLookback.unshift(bot.actualCandle);
  if (!source_key) source_key = 'close'
  if (bot.lookback.length >= length) {
    let SMA = auxLookback
      .slice(0, length)
      .reduce((sum, candle) => {
        return sum + candle["close"]
      }, 0)
    bot.actualCandle[key] = SMA / length
  }
}

