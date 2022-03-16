const BaseClient = require('./BaseClient');
const sqlite3 = require('sqlite3').verbose();

class DBManager extends BaseClient {
    constructor(client, bot, dbPath) {
        super(client, bot);
        this.dbPath = dbPath;
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Connected to database by path: ${__dirname + dbPath}`);
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Database connection closed');
        });
    }
}
module.exports.DBManager = DBManager;