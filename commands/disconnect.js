const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Diconnects from voice channel'),
    async execute(interaction, bot) {
            const guild = bot.getGuild(interaction.guild.id);

            guild.voice.disconnect();
            interaction.reply("Disconnected!");
    },
};