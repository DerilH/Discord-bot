const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Finds random meme')
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
		
        const meme = await guild.meme.randomMeme();
        interaction.reply({embeds: [meme.embed]});
	},
};