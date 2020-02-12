const TelegramBot = require('node-telegram-bot-api');
const {token} = require('./config.json');
const {sendInstant} = require('./src/news');
const sendAutomation = require('./src/sendAutomation');
const subscribe = require('./src/subscribe');
const unsubscribe = require('./src/unsubscribe');

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
    const startMessage = 
        'Hey there! In need of programmer news or you a programmer that need to be updated on latest news on programming stack? Well, you\'ve come to right place. See /help for more details.'
    bot.sendMessage(msg.chat.id, startMessage);
});

bot.onText(/\/help/, (msg) => {
    const helpMessage =
        'Hey I\'m the Programmer_News_Bot. Are you programmer or someone into knowing about programming. Well, I\'m here for you. \n\nI can get you some hot news in the programming coming staright from the popular YCombinator\'s Hacker News. Want to get started? \n\nAll you\'ve do is hit /subscribe and you are in our list of news subscribers. I deliver the news 4 times a day everyday of year. Excited eh? Hit /subscribe now\n\n If you think I\'m disturbing you all you have to do is /unsubscribe. I\'m very sad to see you leave! That\'s all you had to know! Now get started by hitting /subscribe. \n\nIf you don\'t want news messages cluttering up every 6 hours! Then /send command is here for you use it get the news instantly.';
    
    bot.sendMessage(msg.chat.id, helpMessage);
});

bot.onText(/\/subscribe/, (msg) => {
    const subscribeMessage = 
        'You\'re now subscribed! Now you get news every 6 hours a day, starting from 0:00 UTC. \n\nIf you want to stop our service at any time just hit /unsubscribe';

    subscribe(msg.chat.username, msg.chat.id);
    bot.sendMessage(msg.chat.id, subscribeMessage);
});

bot.onText(/\/unsubscribe/, (msg) => {
    const unsubscribeMessage = 
        'I\'ve removed you from the subscribers list. I\'m sad to see you leave. Hope to see you again soon. \n\nBut If you had a change of mind! Hit /subscribe now.';
        
    unsubscribe(msg.chat.id);
    bot.sendMessage(msg.chat.id, unsubscribeMessage);
});

bot.onText(/\/send/, (msg) => {
    const text = msg.text.split(' ');
    const newsNumber = parseInt(text[1]);
    if(isNaN(newsNumber) && text.length > 1)
        bot.sendMessage(msg.chat.id, 'Send a valid number of messages to send');
    else if(text.length > 1)
        sendInstant(bot, msg.chat.id, newsNumber);
    else
        sendInstant(bot, msg.chat.id);
});

sendAutomation(bot);