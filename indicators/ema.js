module.exports = function ema (lookback, actualCandle, key, length, source_key) {
  let auxLookback = lookback.slice();
  if (!source_key) source_key = 'close'
  if (auxLookback.length >= length) {
    var prev_ema = lookback[0][key]
    if (typeof prev_ema === 'undefined' || isNaN(prev_ema)) {
      var sum = 0
      auxLookback.slice(0, length).forEach(function (candle) {
        sum += candle[source_key]
      })
      prev_ema = sum / length
    }
    var multiplier = 2 / (length + 1)
    return (actualCandle[source_key] - prev_ema) * multiplier + prev_ema
  }
}

