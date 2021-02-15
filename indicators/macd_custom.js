module.exports = function macd (bot) {
    let length = 12;
    bot.actualCandle.macd = bot.actualCandle.ema38 - bot.actualCandle.ema70;
    let auxLookback = bot.lookback.slice();
    auxLookback.unshift(bot.actualCandle);
    if (auxLookback.length >= length) {
      let prev_signal = bot.lookback[0]["signal"]
      if (typeof prev_signal === 'undefined' || isNaN(prev_signal)) {
        let sum = 0;
        auxLookback.slice(0, length).forEach(function (candle) {
          sum += candle["macd"];
        })
        let signal = sum / length;
        bot.actualCandle["signal"] = signal;
      } else {
        bot.actualCandle["signal"] = (bot.actualCandle["macd"] * (2 / (length + 1)) + prev_signal * (1 - (2 / (length + 1))));
        bot.actualCandle["histogram"] = bot.actualCandle.macd - bot.actualCandle.signal;
      }
    }
}