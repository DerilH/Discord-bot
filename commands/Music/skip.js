const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip songs')
        .addIntegerOption(option => option
            .setName('number')
            .setDescription("Number of songs to skip")
            .setRequired(false))
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const number = interaction.options.getInteger('number');

		guild.voice.checkConnectedErr();

        if (guild.music.playing == false) {
            guild.errorEmitter.emit('interactionError', "No song are playing now");
            return;
        }
        
        if(number < 0) {
            guild.errorEmitter.emit('interactionError', "Inalid number");
            return
        }

        const skippedSongs = guild.music.skip(number);
        if(number > 1) {
            let reply = "";
            skippedSongs.forEach(song => {
                reply += "`"+ song.info.title + "`" + ' skipped\n';
            })
            interaction.reply(reply);
        }else 
        {
            interaction.reply("`" + skippedSongs[0].info.title + "` " + " skipped")
        };
    },
};