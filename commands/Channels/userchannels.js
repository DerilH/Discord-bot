const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { DBManager } = require('../../DBManager');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('userchannels')
        .setDescription('User cahnnels control')
        .addStringOption(option => {return option
            .setName('state')
            .setDescription('Enable/Disable user channels')
            .setRequired(true)
            .addChoice('Enable', 'enable')
            .addChoice('Disable', 'disable');
        })
        .setDefaultPermission(false),
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const state = interaction.options.getString('state');

        if(state == 'enable' ) {
            const node = await guild.channel.enableUserChannels();
            
            if (await bot.dbManager.guildExists(guild.id, 'userChannels')) {
                await bot.dbManager.editUserChannel(guild.id, true, node.creatorChannel.id);
            } else {
                await bot.dbManager.insertUserChannel(guild.id, true, node.creatorChannel.id);
            }
            interaction.reply('User channels enabled');
        } else if(state == 'disable') {
            guild.channel.disableUserChannels();

            if (await bot.dbManager.guildExists(guild.id, 'userChannels')) {
                await bot.dbManager.editUserChannel(guild.id, false, null);    
            } else {
                await bot.dbManager.insertUserChannel(guild.id, false, null);
            }
            interaction.reply('User channels disabled');
        } else await interaction.reply("Invalid option");
    }
};