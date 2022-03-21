const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('continue')
		.setDescription('Continues the current song!')
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
		
		guild.voice.checkConnectedErr();

        if (guild.music.playing == false) {
            guild.errorEmitter.emit('interactionError', "No songs are playing now");
            return;
        }

        guild.music.unPause();
        
        interaction.reply("Continued");
	},
};