const { BaseManager } = require('../BaseManager');
const { TemporaryChannelManager } = require('./TemporaryChannelManager');
class ChannelManager extends BaseManager {

    constructor(client, bot, guild) {
        super(client, bot, guild);
        this.temporaryChannels = new TemporaryChannelManager(client, bot, guild, this);
    }

    async createChannel(name, options) {
        let channel = await this.guild.guild.channels.create(name, options);
        return channel;
    }
    
    async createChannelIn(name, options, category) {
        let channel = await category.createChannel(name, options);
        return channel;
    }
}
module.exports.ChannelManager = ChannelManager;