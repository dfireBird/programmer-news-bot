const sqlite3 = require('sqlite3');
const request = require('./request');

async function getTopNews() {
    const topStoriesUrl =
      'https://hacker-news.firebaseio.com/v0/topstories.json';
    
    const topstories = await request(topStoriesUrl);

    let messages = [];
    let i = 0;
    for(const item of topstories) {
        if(++i > 10)
            break;
        
        const itemUrl = `https://hacker-news.firebaseio.com/v0/item/${item}.json`;

        const topItem = await request(itemUrl);

        if(topItem.url === undefined) {
            i--;
            continue;
        }
        
        const message = `${topItem.title} \n\n${topItem.url}`;

        messages.push(message);
    }

    return messages;
}

function sendInstantTopNews(bot, msg) {
    getTopNews().then(messages => {
        for(const message of messages) {
            bot.sendMessage(msg.chat.id, message);
        }
    });
}

function sendDailyTopNews(bot) {
    const db = new sqlite3.Database('./data/subscribers.sqlite3')
    getTopNews().then(messages => {
        db.each('SELECT chatid FROM user_info', (err, id) => {
            if(err) {
                console.log(err);
            }

            for(const message of messages) {
                bot.sendMessage(id.chatid, message);
            }
        });
    });
}

exports.sendInstant = sendInstantTopNews;
exports.sendDaily = sendDailyTopNews;