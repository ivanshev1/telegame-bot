const TelegramApi = require('node-telegram-bot-api');
const { Token } = require('./token.js');
const { gameOptions, againOptions } = require('./options.js');

const bot = new TelegramApi(Token, { polling: true });

const chats = {}

async function startGame(chatId) {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9');
    const number = Math.floor(Math.random() * 10)
    chats[chatId] = number;
    await bot.sendMessage(chatId, `Start guessing`, gameOptions);
}

function start() {
    bot.setMyCommands([
        {command: '/start', description: 'Greeting'},
        {command: '/info', description: 'Send username'},
        {command: '/game', description: 'Guess The Number'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, 'Welcome');
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `You are ${msg.from.first_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'No such command!');

    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return await bot.sendMessage(chatId, `Congrats, you guessed the number ${chats[chatId]}!`,
                againOptions);
        } else {
            return await bot.sendMessage(chatId, `Sorry, try again. The number was ${chats[chatId]}`,
                againOptions);
        }
    })
}

start()