const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection  } = require('@discordjs/voice');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continues the current song!'),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        guild.music.unPause();
        
        interaction.reply("Continued");
	},
};