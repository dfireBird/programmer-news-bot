const sqlite3 = require('sqlite3').verbose();

function subscribe(username, id) {
    const db = new sqlite3.Database('./data/subscribers.sqlite3');

    db.serialize(() => {
        db.run('CREATE TABLE if not exists user_info (username TEXT, chatid INT PRIMARY KEY)');

        const insert = db.prepare('INSERT INTO user_info VALUES(?, ?)');

        db.all('SELECT chatid FROM user_info', (err, result) => {
            if(err) {
                console.log(err);
            }

            let isAvail = false;
            for (const ids of result) {
                if(ids.chatid === id)
                    isAvail = true;
            }
            
            if(!isAvail) {
                insert.run(username, id);
            }
        });

    });
}

module.exports = subscribe;