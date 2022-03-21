const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connects to voice channel')
        .setDefaultPermission(true),
	permissions: [Permissions.FLAGS.SEND_MESSAGES],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

        if(interaction.member.voice.channel)
        {
            if(interaction.member.voice.channel === interaction.guild.me.voice.channel)
            {
                guild.errorEmitter.emit('interactionError', 'I`m already here');
            }
            
            guild.voice.connect(interaction.member.voice.channel.id);
            interaction.reply("Connected");
        } else 
        {
            await guild.errorEmitter.emit('interactionError', "You must enter to voice channel");
        }
    },
};