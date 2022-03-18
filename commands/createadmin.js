const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionOverwrites } = require('discord.js');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('createadmin')
		.setDescription('Create admin role'),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

        guild.guild.roles.create({
            name: 'Administrator',
            color: 'BLUE',
            permissions: Permissions.FLAGS.ADMINISTRATOR
        })


	    interaction.reply({content:"Role created",ephemeral: true});
    },
};