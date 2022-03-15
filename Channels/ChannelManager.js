const {BaseManager} = require('../BaseManager');
const { ChannelNode } = require('./ChannelNode');
class ChannelManager extends BaseManager{

    userChannelNodes = new Array();

    constructor(client, bot, guild)
    {
        super(client, bot, guild);
    }

    async createChannel(name, options)
    {
        let channel = await this.guild.guild.channels.create(name, options);
        return channel;
    }

    async createChannelIn(name, options, category) 
    {
        let channel = await category.createChannel(name, options);
        return channel;
    }

    async createUserChannelNode(category)
    {
        let node = new ChannelNode(this);

        if (category == undefined) {
            node.category = await this.createChannel('User channels', {
                type: 'GUILD_CATEGORY'
            });
            console.log(node.category);
            console.log(1);
            node.creatorChannel = await this.createChannelIn('Create room', {
             type: 'GUILD_VOICE'
            }, node.category)
        }
    }
}
module.exports.ChannelManager = ChannelManager;