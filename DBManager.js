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
        const exists = await this.guildExists(guildId, "userChannels");
        if(exists){
            await this.db.run(`UPDATE userChannels SET enabled = ?, creatorChannelId = ? WHERE guildId = ?`, [enabled, creatorChannelId, guildId])
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            })
        } else {
            await this.db.run(`INSERT INTO userChannels (guildId, enabled, creatorChannelId) VALUES (?, ?, ?)`, [guildId, enabled, creatorChannelId])
            .catch(err => {
                console.log(err);
            })
        } 
    }

    async guildExists(guildId, table) {
        let exists = false;
        await this.db.get(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE guildId = ?)`, [guildId]).then(row => {
            if(row['EXISTS(SELECT 1 FROM userChannels WHERE guildId = ?)'] == 1) exists = true;
        })
        return exists;
    }

    async getUserChannel(guildId) {
        const exists = await this.guildExists(guildId, "userChannels");
        if(!exists){
            return undefined;
        }
        let userChannel
        await this.db.get(`SELECT * FROM userChannels WHERE guildId = ?`, [guildId]).then(row =>{
            userChannel = row;
        });
        return userChannel;
    }
}
module.exports.DBManager = DBManager;