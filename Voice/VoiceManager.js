const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");
const { BaseManager } = require("../BaseManager");

class VoiceManager extends BaseManager 
{
    constructor(client, bot, guild)
    {
        super(client, bot, guild);
    }

    get connection() {
        var connection = getVoiceConnection(this.guild.id);
        if (!connection) {
            return "I`m not connected";
        }
        return connection;
    }

    connect(channelId)
    {
        joinVoiceChannel({
            channelId: channelId,
            guildId: this.guild.id,
            adapterCreator: this.guild.guild.voiceAdapterCreator
        });
    }

    disconnect()
    {
        this.connection.destroy();
    }
}
module.exports.VoiceManager = VoiceManager;