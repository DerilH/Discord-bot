class ChannelNode {

    category
    creatorChannel
    #channels = new Array();

    contructor(channelManager) {
        this.channelManager = channelManager;
    }

    getChannel(channelId) {
        return this.#channels.find(item => item.id == channelId);
    }

    addChannel(channel) {
        this.#channels.push(channel);
    }
}
module.exports.ChannelNode = ChannelNode;