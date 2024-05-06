const TelegramApi = require('node-telegram-bot-api');
const { Token } = require('./token.js');
const { gameOptions, againOptions } = require('./options.js');
const {Sequelize} = require("sequelize");
const sequelize = require('./db.js')
const UserModel = require('./models.js');

const bot = new TelegramApi(Token, { polling: true });

const chats = {}

async function startGame(chatId) {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9');
    const number = Math.floor(Math.random() * 10)
    chats[chatId] = number;
    await bot.sendMessage(chatId, `Start guessing`, gameOptions);
}

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('COULD NOT CONNECT TO DB:', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Greeting'},
        {command: '/info', description: 'Send username'},
        {command: '/game', description: 'Guess The Number'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        try {
            if (text === '/start') {
                await UserModel.create({chatId})
                return bot.sendMessage(chatId, 'Welcome');
            }
            if (text === '/info') {
                const user = await UserModel.findOne({chatId})
                return bot.sendMessage(chatId, `You are ${msg.from.first_name}, you have ${user.right} correct and ${user.wrong} incorrect answers in game`);
            }
            if (text === '/game') {
                return startGame(chatId);
            }

            return bot.sendMessage(chatId, 'No such command!');
        } catch (e) {
            return bot.sendMessage(chatId, 'Something went wrong!');
        }

    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }
        const user = await UserModel.findOne({chatId})
        if (data == chats[chatId]) {
            user.right += 1;
            await bot.sendMessage(chatId, `Congrats, you guessed the number ${chats[chatId]}!`,
                againOptions);
        } else {
            user.wrong += 1;
            await bot.sendMessage(chatId, `Sorry, try again. The number was ${chats[chatId]}`,
                againOptions);
        }
        await user.save();
    })
}

start()