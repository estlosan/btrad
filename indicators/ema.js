module.exports = function ema (bot, key, length, source_key) {
  let auxLookback = bot.lookback.slice();
  auxLookback.unshift(bot.actualCandle);
  if (!source_key) source_key = 'close';
  if (auxLookback.length >= length) {
    let prev_ema = bot.lookback[0][key]
    if (typeof prev_ema === 'undefined' || isNaN(prev_ema)) {
      let sum = 0;
      auxLookback.slice(0, length).forEach(function (candle) {
        sum += candle[source_key];
      })
      let ema = sum / length;
      bot.actualCandle[key] = ema;
    } else {
      let multiplier = 2 / (length + 1);
      bot.actualCandle[key] = (bot.actualCandle[source_key] - prev_ema) * multiplier + prev_ema;
    }
  }
}

