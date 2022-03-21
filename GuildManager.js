const { BaseClient } = require("./BaseClient");
const { BotErrorEmitter } = require("./GuildErrorEmitter");
const { ChannelManager } = require("./Channels/ChannelManager");
const { MusicManager } = require("./Music/MusicManager");
const { TikTokManager } = require("./Entertainment/TikTokManager");
const { VoiceManager } = require("./Voice/VoiceManager");
const { MemesManager } = require("./Entertainment/MemesManager");
const { ModerationManager } = require("./ModerationManager");

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
        this.tiktok = new TikTokManager(client, bot, this);
        this.meme = new MemesManager(client, bot, this);
        this.moderation = new ModerationManager(client, bot, this);
    }
}
module.exports.GuildManager = GuildManager;

