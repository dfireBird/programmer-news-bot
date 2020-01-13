const request = require('./request');

async function getTopNews(bot, msg) {
    const topStoriesUrl =
      'https://hacker-news.firebaseio.com/v0/topstories.json';
    
    const topstories = await request(topStoriesUrl);

    let i = 0;
    for(let item of topstories) {
        if(++i > 10)
            return;
        
        const itemUrl = `https://hacker-news.firebaseio.com/v0/item/${item}.json`;

        const topItem = await request(itemUrl);

        const message = `${topItem.title} \n\n${topItem.url}`;

        bot.sendMessage(msg.chat.id, message);
    }
}

module.exports = getTopNews;