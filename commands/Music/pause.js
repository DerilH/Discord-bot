const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('Pauses the current song!')
		.setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

		guild.voice.checkConnectedErr();
		
        if (guild.music.playing == false) {
			guild.errorEmitter.emit('interactionError', "No song is playing now");
        }

        guild.music.pause();
        
        interaction.reply("Paused");
	},
};