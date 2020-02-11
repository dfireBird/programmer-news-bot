const sqlite3 = require('sqlite3');
const hackerNewsAPI = require('hacker-news-wrapper');

async function getTopNews() {
    const topstories = await hackerNewsAPI.fetchTopStories();

    let messages = [];
    let i = 0;
    for(const item of topstories) {
        if(++i > 10)
            break;

        const topItem = await hackerNewsAPI.fetchItem(item);

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