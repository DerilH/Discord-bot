const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('Connects to voice channel'),
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);

        if(interaction.member.voice.channel)
        {
            if(interaction.member.voice.channel === interaction.guild.me.voice.channel)
            {
                interaction.reply("I'm already here!")
                return;
            }
            guild.voice.connect(interaction.member.voice.channel.id);
            interaction.reply("Connected");
        } else 
        {
            interaction.reply("You must enter to voice channel");
        } 
    },
};