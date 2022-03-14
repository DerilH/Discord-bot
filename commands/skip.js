const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip currently playing song'),
    async execute(interaction, bot) {
            const guild = bot.getGuild(interaction.guild.id);

            interaction.reply(guild.music.songQueue.current.info.title + " skipped!");
            guild.music.skip();
    },
};