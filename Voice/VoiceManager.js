const { joinVoiceChannel } = require("@discordjs/voice");
const { getVoiceConnection } = require("@discordjs/voice");
const { BaseManager } = require("../BaseManager");
const fs = require('node:fs');
const { pipeline } = require('node:stream');
const prism =  require('prism-media');
const { createWriteStream } = require('node:fs');
const { EndBehaviorType, VoiceReceiver } = require('@discordjs/voice');


class VoiceManager extends BaseManager 
{
    constructor(client, bot, guild)
    {
        super(client, bot, guild);
    }

    get connection() {
        var connection = getVoiceConnection(this.guild.id);
        return connection;
    }

    get connected() 
    {
        if(!this.connection) {
            return false;
        } 
        return true;
    }

    checkConnectedErr()
    {
        if (!this.connection) {
            this.guild.errorEmitter.emit('interactionError', "I`m not connected");
        }
    }

    connect(channelId)
    {
        joinVoiceChannel({
            channelId: channelId,
            guildId: this.guild.id,
            adapterCreator: this.guild.guild.voiceAdapterCreator
        });
    }

    startReceive(userId)
    {
        createListeningStream(this.connection.receiver, userId, this.client.users.cache.get(userId));
        //this.receiverStream = fs.createWriteStream("test.pcm");
        //const audio = this.connection.receiver.subscribe(userId.toString(), {encoding: "utf-8"});
        //audio.pipe(this.receiverStream);
    }
   
    endReceive() 
    {
        this.receiverStream.close();
    }

    disconnect()
    {
        this.connection.destroy();
    }
}
module.exports.VoiceManager = VoiceManager;