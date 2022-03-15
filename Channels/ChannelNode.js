class ChannelNode {

    category
    creatorChannel

    contructor(channelManager) {
        this.channelManager = channelManager;
    }
    
    newCreatorChannel(client, guild, categoryName) {

        if (typeof categoryName === 'string') {
            this.category = guild.channels.create(categoryName, {
                type: 'category'
            }).then(cat => {
                this.creatorChannel = guild.channels.create('Create room', {
                    type: 'GUILD_VOICCE',
                    parent: cat.parentID,
                })
            })
        }
    }
}
module.exports.ChannelNode = ChannelNode;