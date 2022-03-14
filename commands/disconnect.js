const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Diconnects from voice channel'),
    async execute(interaction, bot) {
            const guild = bot.getGuild(interaction.guild.id);

            if(typeof guild.voice.connection === 'string')
            {
                interaction.reply(guild.voice.connection);
                return;
            }

            guild.music.end();
            guild.voice.disconnect();
            interaction.reply("Disconnected!");
    },
};