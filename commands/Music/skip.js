const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getVoiceConnection } = require('@discordjs/voice');
const { Interaction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip currently playing song'),
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
        
        interaction.reply(guild.music.songQueue.current.info.title + " skipped!");
        guild.music.skip();
    },
};