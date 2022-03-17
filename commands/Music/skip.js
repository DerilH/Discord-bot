const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction, Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip currently playing song')
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

		guild.voice.checkConnectedErr();

        if (guild.music.playing == false) {
            interaction.reply("No song are playing now");
            return;
        }
        
        interaction.reply(guild.music.songQueue.current.info.title + " skipped!");
        guild.music.skip();
    },
};