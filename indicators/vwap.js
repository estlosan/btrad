module.exports = function vwap (bot, key) {
  let hlc3 =  (bot.actualCandle.high + bot.actualCandle.low + bot.actualCandle.close) / 3;
  bot.actualCandle.hcl3Volume = parseFloat(hlc3) * parseFloat(bot.actualCandle.volume);
  if (bot.lookback.length > 0) {
    let partsYesterday = bot.lookback[0].time.split(' ')
    let partsToday = bot.actualCandle.time.split(' ')

    if(partsYesterday[0] !== partsToday[0] || partsYesterday[1] !== partsToday[1]){
      bot.actualCandle.comulativeHcl3Volume = bot.actualCandle.hcl3Volume;
      bot.actualCandle.comulativeVolume = bot.actualCandle.volume;
    } else {
      bot.actualCandle.comulativeHcl3Volume = bot.actualCandle.hcl3Volume + bot.lookback[0].comulativeHcl3Volume
      bot.actualCandle.comulativeVolume = bot.lookback[0].comulativeVolume + bot.actualCandle.volume;
    }
    bot.actualCandle[key] = bot.actualCandle.comulativeHcl3Volume / bot.actualCandle.comulativeVolume;
  } 
}

