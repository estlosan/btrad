const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

const chatIdPro = '-459860475'; // Pro
const chatIdDev = '-402612640'; // Test
const chatIdError = '-307261607'; // Error

const timeEmoji = "\u{1F55C}";
const money = "\u{1F4B8}";
const coin = "\u{1F4B0}";
const buy = "\u{1F4C8}"
const sell = "\u{1F4C9}"

// Create a bot that uses 'polling' to fetch new updates
const telegramBot = new TelegramBot(token);

const sendMsg = (bot, chatId, msg) => {
    console.log(msg)
    if (bot.realTrading === true && bot.realTime === true){
        chatId = chatId || chatIdDev;
        telegramBot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
    }
}

const generateMsg = (bot, asset, time, type, orderStatus, price, benefice) => {
    if(type.includes("buy") || type.includes("initial")){
        sendMsg(bot, chatIdPro, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ${buy} <b>COMPRA:</b> ${price}${coin} \n <b>ORDER STATUS:</b> ${orderStatus}\n`);
    }
    else if (type.includes("sell")){
        sendMsg(bot, chatIdPro, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ${sell} <b>VENTA:</b> ${price}${coin}\n <b>BENEFICIO:</b> ${benefice.toFixed(4)}% \n <b>ORDER STATUS:</b> ${orderStatus}`);
    }
    else if(type.includes("preOrder")){
        sendMsg(bot, chatIdDev, ` ${money} #${asset} \n ${timeEmoji} ${time} \n <b>NEW ORDER</b> \n`);
    }
    else if (type.includes("Info")){
        sendMsg(bot, chatIdDev, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ONLINE \n`);
    }
    else if (type.includes("takeProfit")){
        sendMsg(bot, chatIdDev, ` ${money} #${asset} \n ${timeEmoji} ${time} \n TakeProfit updated \n`);
    }
}

module.exports = { generateMsg, sendMsg };