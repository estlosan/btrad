module.exports = function atr (bot, key, length, hhvLength, mult, source_key) {
    if(!bot.lookback[0]) return;
    let auxLookback = bot.lookback.slice();
    auxLookback.unshift(bot.actualCandle);
    if (!source_key) source_key = 'close'

    bot.actualCandle["true_range"] = 
        Math.max(
            bot.actualCandle.high - bot.actualCandle.low, 
            Math.abs(bot.actualCandle.high - bot.lookback[0].close), 
            Math.abs(bot.lookback[0].close - bot.actualCandle.low)
        );
    if (bot.lookback.length >= length)  {
        let prev_atr = bot.lookback[0][key];
        if (typeof prev_atr === 'undefined' || isNaN(prev_atr)) {
            let SMA = auxLookback
            .slice(0, length)
            .reduce((sum, candle) => {
                return sum + candle["true_range"]
            }, 0)
            bot.actualCandle[key] = (SMA / length);
        } else {
            bot.actualCandle[key] = (prev_atr * (length - 1) + bot.actualCandle["true_range"]) / length;
        }
        if (bot.lookback.length >= hhvLength){
            bot.actualCandle["atr_trail_stop"] = bot.actualCandle.high - mult * bot.actualCandle[key];
            bot.actualCandle["atr_trail_stop"] = 
                auxLookback
                .slice(0, hhvLength)
                .reduce((max, candle) => {
                    let prev_trail_stop = candle.high - mult * candle[key];
                    if(prev_trail_stop > max){
                        max = prev_trail_stop;
                    }
                    return max;
                }, 0)
        }
    }
  }