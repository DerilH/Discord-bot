const { BaseManager } = require("../BaseManager");

class TemporaryChannelManager extends BaseManager{
    category
    creatorChannel
    channels = []

    constructor(client, bot, guild, channelManager) {
        super(client, bot, guild);
        this.channelManager = channelManager;
    }

    async enable(categoryName, creatorChannelName) {
        if (this.enabled) {
            this.guild.errorEmitter.emit('interactionError', 'Temporary channels already enabled');
        }
        
        if (!categoryName || typeof categoryName != 'string') {
            categoryName = 'Temporary channels';
        }
        if (!creatorChannelName || typeof creatorChannelName !== 'string') {
            creatorChannelName = "Create room";
        }

        this.category = await this.channelManager.createChannel(categoryName, {
            type: 'GUILD_CATEGORY'
        })

        this.creatorChannel = await this.channelManager.createChannelIn(creatorChannelName, {
            type: 'GUILD_VOICE'
        }, this.category)

        this.enabled = true;
        await this.bot.dbManager.insertTempChannel(this.guild.id, true, this.creatorChannel.id);

        return {creatorChannel: this.creatorChannel, enabled: this.enabled, category: this.category};
    }

    async selfLoad() {
        try {
            const exists = await this.bot.dbManager.guildExists(this.guild.id, 'temporaryChannels');
            if (!exists) {
                await this.bot.dbManager.insertTempChannel(this.guild.id, false, undefined)
                return;
            }

            const temporaryChannelsInfo = await this.bot.dbManager.getTempChannel(this.guild.id);
            this.enabled = temporaryChannelsInfo.enabled;
            if (temporaryChannelsInfo.enabled == 0 || temporaryChannelsInfo.creatorChannelId == undefined) return;
            this.creatorChannel = this.guild.guild.channels.cache.get(temporaryChannelsInfo.creatorChannelId);
            this.category = this.creatorChannel.parent;
        } catch (error) {
            console.error(error);
        }
    }

    async handle(oldState, newState){
        const guild = this.bot.getGuild(newState.guild.id);
        
        const item = this.channels.find(element => element == oldState.channel);
        if(item){
            if(oldState.channel.members.size == 0){
                oldState.channel.delete();
                this.channels.splice(this.channels.indexOf(item), 1);
            }
        }
        
        //if(!this.dbManager.guildExists(guild.id, 'userChannels')) return;
        if(this.enabled == 0) return;
        if(newState.channel != this.creatorChannel) return;

        const channel = await this.channelManager.createChannelIn(newState.member.displayName, {type: 'GUILD_VOICE'}, this.category);
        this.channels.push(channel);
        newState.member.voice.setChannel(channel);
    }

    async disable(){
        if (!this.enabled) {
            this.guild.errorEmitter.emit('interactionError', 'User channels already disabled');
        }
        await this.creatorChannel.delete();
        await this.category.delete();
        await this.bot.dbManager.insertTempChannel(this.guild.id, false, null);
        this.enabled = false;
    }
}
module.exports.TemporaryChannelManager = TemporaryChannelManager