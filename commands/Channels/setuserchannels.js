const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { DBManager } = require('../../DBManager');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setuserchannels')
        .setDescription('Set user channels state')
        .addBooleanOption(option => option.setName('state')
            .setDescription('state')
            .setRequired(true)),
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const state = interaction.options.getBoolean('state');

        if (await bot.dbManager.guildExists(guild.id, 'userChannels')) {
            await bot.dbManager.editUserChannel(guild.id, state, null);
        } else {
            await bot.dbManager.insertUserChannel(guild.id, state, null);
        }
        await interaction.reply('ok');
    }
};