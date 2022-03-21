const { parse } = require('dotenv');
const { BanManager } = require('./BanManager');
const { BaseManager } = require('./BaseManager');

class ModerationManager extends BaseManager {

    constructor(client, bot, guild) {
        super(client, bot, guild)
        this.bans = new BanManager(client, bot, guild);
    }

    async clear(channel, number) {
        if (number <= 0) this.guild.errorEmitter('interactionError', "Invalid number", { ephemeral: true });
        channel.bulkDelete(number);
    }

}
module.exports.ModerationManager = ModerationManager;