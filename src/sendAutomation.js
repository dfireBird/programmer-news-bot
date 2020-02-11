const {sendDaily} = require('./news');

const hourinms = 1000 * 60 * 60;

module.exports = bot => {
    const current = new Date()
    const target = new Date();
    target.setUTCHours(current.getUTCHours() + 1);
    target.setUTCMinutes(0, 0, 0);

    setTimeout(() => {
        sendDaily(bot);
        setInterval(() => {
            sendDaily(bot);
        }, hourinms);
    }, target.getTime() - current.getTime());
}