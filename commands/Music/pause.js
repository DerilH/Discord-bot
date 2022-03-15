const { SlashCommandBuilder } = require('@discordjs/builders');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current song!'),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

		guild.voice.checkConnectedErr();
		
        if (guild.music.playing == false) {
			await guild.errorEmitter.emit('interactionError', "No song is playing now");
        }

        guild.music.pause();
        
        interaction.reply("Paused");
	},
};