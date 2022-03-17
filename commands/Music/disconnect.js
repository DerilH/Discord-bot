const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Diconnects from voice channel'),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
    async execute(interaction, bot) {
            const guild = bot.getGuild(interaction.guild.id);

            guild.voice.checkConnectedErr();

            guild.music.end();
            guild.voice.disconnect();
            interaction.reply("Disconnected!");
    },
};