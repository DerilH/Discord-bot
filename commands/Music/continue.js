const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continues the current song!'),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

		if(typeof guild.voice.connection === 'string')
		{
			interaction.reply(guild.voice.connection);
			return;
		}
		
        if (guild.music.playing == false) {
            interaction.reply("No song are playing now");
            return;
        }

        guild.music.unPause();
        
        interaction.reply("Continued");
	},
};