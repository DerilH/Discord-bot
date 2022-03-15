const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('loop')
        .addBooleanOption(option => option.setName('state')
            .setDescription('Looped state')
            .setRequired(true)),
    async execute(interaction, bot) {
            const guild = bot.getGuild(interaction.guild.id);

            guild.music.looped = interaction.options.getBoolean('state');

            interaction.reply("Loop!");
    },
};