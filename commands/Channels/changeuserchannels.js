const { SlashCommandBuilder } = require('@discordjs/builders');
const { DBManager } = require('../../DBManager');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('changeuserchannels')
        .setDescription('change')
        .addBooleanOption(option => option.setName('state')
            .setDescription('state')
            .setRequired(true)),
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const state = interaction.options.getBoolean('state');

        if (bot.dbManager.guildExists(guild.id, 'userChannels')) {
            bot.dbManager.editUserChannel(guild.id, state, null);
        } else {
            bot.dbManager.insertUserChannel(guild.id, state, null);
        }

        interaction.reply('ok');
    },
};