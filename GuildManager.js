const { BaseClient } = require("./BaseClient");
const { BotErrorEmitter } = require("./BotErrorEmitter");
const { ChannelManager } = require("./Channels/ChannelManager");
const { MusicManager } = require("./Music/MusicManager");
const { VoiceManager } = require("./Voice/VoiceManager");

class GuildManager extends BaseClient
{
    constructor(client, bot, guild)
    {
        super(client, bot);
        this.guild = guild;
        this.id = guild.id

        this.music = new MusicManager(client, bot, this); 
        this.voice = new VoiceManager(client, bot, this);   
        this.channel = new ChannelManager(client, bot, this); 
        this.errorEmitter = new BotErrorEmitter(bot);
    }
}
module.exports.GuildManager = GuildManager;

