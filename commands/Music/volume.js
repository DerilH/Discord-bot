const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection  } = require('@discordjs/voice');
const { Guild, Permissions } = require('discord.js');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Changes volume up to 200%')
        .addIntegerOption(option => option
            .setName('volume')
            .setDescription("volume")
            .setRequired(true))
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const volume = interaction.options.getInteger('volume');
        if(volume > 200) 
        {
            guild.errorEmitter.emit('interactionError', 'Number is more than 200')
            return;
        }

		guild.voice.checkConnectedErr();
		
        if (guild.music.playing == false) {
            guild.errorEmitter.emit('interactionError', 'No song are playing now')
s       }
        
        guild.music.setVolume(volume, interaction.guild.id);
	    interaction.reply("Volume changed to " + volume + "%");
    },
};