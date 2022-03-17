const { BaseClient } = require('./BaseClient');
const Database = require('sqlite-async')

class DBManager extends BaseClient {
    constructor(client, bot, dbPath) {
        super(client, bot);
        this.openDB(dbPath);
    }

    openDB(dbPath) {
        this.dbPath = dbPath;
        Database.open(dbPath).then(db => {
            this.db = db;
        }).catch(err => {
            console.log(err);
        });
        console.log('Database opened')
    }

    close() {
        this.db.close().catch(err => {
            console.log(err)
        });
        console.log("Database closed")
    }

    async insertUserChannel(guildId, enabled, creatorChannelId) {
        await this.db.run(`INSERT INTO userChannels (guildId, enabled, creatorChannelId) VALUES (?, ?, ?)`, [guildId, enabled, creatorChannelId])
        .catch(err => {
            console.log(err);
        })
        console.log('inserted');
    }

    async editUserChannel(guildId, enabled, creatorChannelId) {
        await this.db.run(`UPDATE userChannels SET enabled = ?, creatorChannelId = ? WHERE guildId = ?`, [enabled, creatorChannelId, guildId])
        .catch(err => {
            if (err) {
                console.log(err);
            }
        })
        console.log('edited');
    }

    async guildExists(guildId, table) {
        let exists = false;
        await this.db.get(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE guildId = ?)`, [guildId]).then(row => {
            if(row['EXISTS(SELECT 1 FROM userChannels WHERE guildId = ?)'] == 1) exists = true;
            console.log(row);
        })
        console.log('Exists ' + exists);
        return exists;
    }

    async getCreatorChannel(guildId) {
        let creatorChannelId
        await this.db.get(`SELECT * FROM userChannels WHERE guildId = ?`, [guildId]).then(row =>{
            creatorChannelId = row.creatorChannelId;
        });

        return creatorChannelId;
    }
}
module.exports.DBManager = DBManager;