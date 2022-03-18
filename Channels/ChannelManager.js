const { BaseManager } = require('../BaseManager');
const { ChannelNode } = require('./ChannelNode');
class ChannelManager extends BaseManager {

    userChannelNode

    constructor(client, bot, guild) {
        super(client, bot, guild);
    }

    async loadUserChannels(){
        try{
            const exists =  await this.bot.dbManager.guildExists(this.guild.id, 'userChannels');
            if(!exists) {
                await this.bot.dbManager.insertUserChannel(this.guild.id, false, undefined)
                return;
            }

            const userChannel = await this.bot.dbManager.getUserChannel(this.guild.id);
            this.userChannelNode = new ChannelNode(this);
            this.userChannelNode.enabled = userChannel.enabled;
            if(userChannel.enabled == 0 || userChannel.creatorChannelId == undefined) return;
            this.userChannelNode.creatorChannel = this.guild.guild.channels.cache.get(userChannel.creatorChannelId);
            this.userChannelNode.category = this.userChannelNode.creatorChannel.parent;
        } catch(error) {
            console.error(error);
        }
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

        if(this.userChannelNode && this.userChannelNode.enabled){
            this.guild.errorEmitter.emit('interactionError', 'User channels already enabled');
        }

        node.category = await this.createChannel('User channels', {
            type: 'GUILD_CATEGORY'
        })
        node.creatorChannel =  await this.createChannelIn('Create room', {
            type: 'GUILD_VOICE'
        }, node.category)
        node.enabled = true;
        await this.bot.dbManager.insertUserChannel(this.guild.id, true, node.creatorChannel.id);
        
        
        this.userChannelNode = node;
        return this.userChannelNode;
    }

    async disableUserChannels() {
        if(!this.userChannelNode || !this.userChannelNode.enabled){
            this.guild.errorEmitter.emit('interactionError', 'User channels already disabled');
        }
        await this.userChannelNode.creatorChannel.delete();
        await this.userChannelNode.category.delete();
        await this.bot.dbManager.insertUserChannel(this.guild.id, false, null);
        this.userChannelNode.enabled = false;
    }
}
module.exports.ChannelManager = ChannelManager;