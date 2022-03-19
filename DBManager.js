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

    async insertTempChannel(guildId, enabled, creatorChannelId) {
        const exists = await this.guildExists(guildId, "temporaryChannels");
        if(exists){
            await this.db.run(`UPDATE temporaryChannels SET enabled = ?, creatorChannelId = ? WHERE guildId = ?`, [enabled, creatorChannelId, guildId])
            .catch(err => {
                if (err) {
                    console.log(err);
                }
            })
        } else {
            await this.db.run(`INSERT INTO temporaryChannels (guildId, enabled, creatorChannelId) VALUES (?, ?, ?)`, [guildId, enabled, creatorChannelId])
            .catch(err => {
                console.log(err);
            })
        } 
    }

    async guildExists(guildId, table) {
        let exists = false;
        await this.db.get(`SELECT EXISTS(SELECT 1 FROM ${table} WHERE guildId = ?)`, [guildId]).then(row => {
            if(row[`EXISTS(SELECT 1 FROM ${table} WHERE guildId = ?)`] == 1) exists = true;
        })
        return exists;
    }

    async getTempChannel(guildId) {
        const exists = await this.guildExists(guildId, "temporaryChannels");
        if(!exists){
            return undefined;
        }
        let tempChannel
        await this.db.get(`SELECT * FROM temporaryChannels WHERE guildId = ?`, [guildId]).then(row =>{
            tempChannel = row;
        });
        return tempChannel;
    }
}
module.exports.DBManager = DBManager;