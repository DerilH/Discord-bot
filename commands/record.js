const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('record')
		.setDescription('Records user voice')
	.setDefaultPermission(false),
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

		if(typeof guild.voice.connection === 'string')
		{
			interaction.reply(guild.voice.connection);
			return;
		}

        guild.voice.startReceive(interaction.member.id);
        
        interaction.reply("Receive started");
	},
};