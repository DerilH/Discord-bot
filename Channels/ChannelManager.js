const {BaseManager} = require('../BaseManager');
const { ChannelNode } = require('./ChannelNode');
class ChannelManager extends BaseManager{

    userChannelNodes = new Array();

    constructor(client, bot, guild)
    {
        super(client, bot, guild);

    }
}
module.exports.ChannelManager = ChannelManager;