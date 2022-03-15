const { Permissions } = require('discord.js');
const BaseClient = require('../BaseClient');

class ChannelNode {

    contructor(channelManager) {
        this.channelManager = channelManager;
    }
    
    newCreatorChannel(client, guild, categoryName) {
        if (categoryNames == undefined) {
            this.category = guild.channels.create('User channels', {
                type: 'category'
            }).then(cat => {
                this.creatorChannel = guild.channels.create('Create room', {
                    type: 'GUILD_VOICCE',
                    parent: cat.parentID,
                })
            })
        }
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