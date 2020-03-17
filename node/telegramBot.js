const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

const chatIdPro = '-459860475'; // Pro
const chatIdDev = '-402612640'; // Test

const timeEmoji = "\u{1F55C}";
const money = "\u{1F4B8}";
const coin = "\u{1F4B0}";
const buy = "\u{1F4C8}"
const sell = "\u{1F4C9}"

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);

const sendMsg = (chatId, msg) => {
    bot.sendMessage(chatId, msg, { parse_mode: 'HTML' });
}

const generateMsg = (asset, time, type, price, benefice) => {
    if(type.includes("buy") || type.includes("initial")){
        sendMsg(chatIdPro, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ${buy} <b>COMPRA:</b> ${price}${coin}\n`);
    }
    else if (type.includes("sell")){
        sendMsg(chatIdPro, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ${sell} <b>VENTA:</b> ${price}${coin}\n <b>BENEFICIO:</b> ${benefice.toFixed(4)}%`);
    }
    sendMsg(chatIdDev, ` ${money} #${asset} \n ${timeEmoji} ${time} \n ONLINE \n`);
}

module.exports = { generateMsg, sendMsg };