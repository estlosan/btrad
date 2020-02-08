module.exports = function sma (lookback, actualCandle, length, source_key) {
  let auxLookback = lookback.slice();
  auxLookback.unshift(actualCandle);
  if (!source_key) source_key = 'close'
  if (lookback.length >= length) {
    let SMA = auxLookback
      .slice(0, length)
      .reduce((sum, candle) => {
        return sum + candle["close"]
      }, 0)
    return SMA / length
  } else{
    console.log("Length is too high. Increase CandleLimit");
  }
}

