const { SlashCommandBuilder } = require('@discordjs/builders');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('createuserchannels')
		.setDescription('Switch user channels option'),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        
        guild.channel.createUserChannelNode(undefined);

        interaction.reply("Created");
	},
};