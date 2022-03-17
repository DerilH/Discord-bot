const { BaseManager } = require('../BaseManager');
const { ChannelNode } = require('./ChannelNode');
class ChannelManager extends BaseManager {

    userChannelNode;

    constructor(client, bot, guild) {
        super(client, bot, guild);
    }

    async createChannel(name, options) {
        let channel = await this.guild.guild.channels.create(name, options);
        return channel;
    }

    async createChannelIn(name, options, category) {
        let channel = await category.createChannel(name, options);
        return channel;
    }

    async enableUserChannels() {
        let node = new ChannelNode(this);

        node.category = await this.createChannel('User channels', {
            type: 'GUILD_CATEGORY'
        });
        node.creatorChannel = await this.createChannelIn('Create room', {
            type: 'GUILD_VOICE'
        }, node.category)

        this.userChannelNode = node;
        return this.userChannelNode;
    }

    async disableUserChannels() {
        await this.userChannelNode.creatorChannel.delete();
        await this.userChannelNode.category.delete();
    }
}
module.exports.ChannelManager = ChannelManager;