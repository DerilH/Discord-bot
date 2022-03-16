const { BaseClient } = require('./BaseClient');
const sqlite3 = require('sqlite3').verbose();

class DBManager extends BaseClient {
    constructor(client, bot, dbPath) {
        super(client, bot);
        this.dbPath = dbPath;
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Database opened`);
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Database closed');
        });
    }

    insertUserChannel(guildId, enabled, creatorChannelId) {
        this.db.run(`INSERT INTO userChannels (guildId, enabled, creatorChannelId) VALUES (?, ?, ?)`, [guildId, enabled, creatorChannelId], err => {
            if (err) {
                console.log(err);
            }
        })
        console.log('inserted');
    }

    editUserChannel(guildId, enabled, creatorChannelId) {
        this.db.run(`UPDATE userChannels SET enabled = ?, creatorChannelId = ? WHERE guildId = ?`[enabled, creatorChannelId, guildId], err => {
            if (err) {
                console.log(err);
            }
        })
        console.log('edited');
    }

    guildExists(guildId, table) {
        let exists = false;
        this.db.get(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE guildId = ?)`, [guildId], (err, row) => {
            if (err) {
                console.log(err);
            }
            console.log(row);
            if (row[1] == 1) exists = true;
        });
        console.log('Exists ' + exists);
        return exists;
    }

    getCreatorChannel(guildId) {
        let creatorChannelId;
        this.db.get(`SELECT * FROM userChannels WHERE guildId = ?`, [guildId], (err, row) => {
            if (err) {
                console.log(err);
            }
            creatorChannelId = row.creatorChannelId;
        })
        return creatorChannelId;
    }
}
module.exports.DBManager = DBManager;