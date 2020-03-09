const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1050695917:AAF6t_asLBmkKYtE40EPB3HxpeyrdJychaw';

//const chatId = '-459860475'; // Pro

const chatId = '-402612640'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const sendMsg = (msg) => {
    bot.sendMessage(chatId, msg);
}

module.exports = sendMsg;