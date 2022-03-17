const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('createuserchannels')
		.setDescription('Switch user channels option'),
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        
        guild.channel.createUserChannelNode(undefined);

        interaction.reply("Created");
	},
};