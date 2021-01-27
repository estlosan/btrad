module.exports = function heikinAshi (bot, key) {
  if (bot.lookback.length > 0) {
    let prev = bot.lookback[0]
    if (typeof prev[key] !== 'undefined') {
      bot.actualCandle[key] = {
        open: (prev[key].open + prev[key].close) / 2,
        high: Math.max(bot.actualCandle.open, bot.actualCandle.high, bot.actualCandle.close),
        low: Math.min(bot.actualCandle.open, bot.actualCandle.low, bot.actualCandle.close),
        close: (bot.actualCandle.open + bot.actualCandle.high + bot.actualCandle.low + bot.actualCandle.close) / 4,
      }
    }
    else{
      bot.actualCandle[key] = {
        open: (prev.open + prev.close) / 2,
        high: Math.max(bot.actualCandle.open, bot.actualCandle.high, bot.actualCandle.close),
        low: Math.min(bot.actualCandle.open, bot.actualCandle.low, bot.actualCandle.close),
        close: (bot.actualCandle.open + bot.actualCandle.high + bot.actualCandle.low + bot.actualCandle.close) / 4,
      }
    }
  }
}