const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('getrole')
		.setDescription('Get admin role'),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

        const rolesC = await guild.guild.roles.fetch();
        const roles = Array.from( rolesC.values());
        const role = roles.find(role => role.name == 'Administrator')
        interaction.member.roles.add(role);

	    interaction.reply({content: "Role add",ephemeral: true});
    },
};