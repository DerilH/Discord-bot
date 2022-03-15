const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continues the current song!'),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
		
		guild.voice.checkConnectedErr();

        if (guild.music.playing == false) {
            await guild.errorEmitter.emit('interactionError', "No songs are playing now");
            return;
        }

        guild.music.unPause();
        
        interaction.reply("Continued");
	},
};