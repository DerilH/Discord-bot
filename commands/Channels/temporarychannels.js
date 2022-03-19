const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { DBManager } = require('../../DBManager');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('temporarychannels')
        .setDescription('Choose temporary channels state')
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
            const node = await guild.channel.temporaryChannels.enable();

            interaction.reply('Temporary channels enabled');
        } else if(state == 'disable') {
            await guild.channel.temporaryChannels.disable();
            
            interaction.reply('Temporary channels disabled');
        } else await interaction.reply("Invalid option");
    }
};