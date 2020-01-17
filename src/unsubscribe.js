const sqlite3 = require('sqlite3').verbose();

function unsubscribe(id) {
    const db = new sqlite3.Database('./data/subscribers.sqlite3');

    db.serialize(() => {
        db.run('DELETE FROM user_info where chatid=?', id, (err) => {
            if(err)
                console.log(err.message);
        })
    });
}

module.exports = unsubscribe;