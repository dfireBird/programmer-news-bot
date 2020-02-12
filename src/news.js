const sqlite3 = require('sqlite3');
const hackerNewsAPI = require('hacker-news-wrapper');

async function getTopNews(n) {
    const topstories = await hackerNewsAPI.fetchTopStories();

    let messages = [];
    let i = 0;
    for(const item of topstories) {
        if(++i > n)
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

function sendInstantTopNews(bot, id, newsNumber = 5) {
    getTopNews(newsNumber).then(messages => {
        for(const message of messages) {
            bot.sendMessage(id, message);
        }
    });
}

function sendHourlyTopNews(bot) {
    const db = new sqlite3.Database('./data/subscribers.sqlite3')
    getTopNews(2).then(messages => {
        db.each('SELECT chatid FROM user_info', (err, id) => {
            if(err) {
                console.log(err);
            }

            bot.sendMessage(id.chatid, '*Start of Hourly News*\n\n\n', {
                parse_mode: 'MarkdownV2'
            });

            for(const message of messages) {
                bot.sendMessage(id.chatid, message);
            }

            bot.sendMessage(id.chatid, '\n\n\n*End of Hourly News*', {
                parse_mode: 'MarkdownV2'
            });
        });
    });
}

exports.sendInstant = sendInstantTopNews;
exports.sendHourly = sendHourlyTopNews;