const { BaseClient } = require("./BaseClient");
const { BaseManager } = require("./BaseManager");
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
    }
}
module.exports.GuildManager = GuildManager;

