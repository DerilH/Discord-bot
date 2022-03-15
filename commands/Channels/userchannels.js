const { SlashCommandBuilder } = require('@discordjs/builders');
 module.exports = {
	data: new SlashCommandBuilder()
		.setName('userchannels')
		.setDescription('Switch user channels option')
        .addBooleanOption(option => option.setName('state')
            .setDescription('State')
            .setRequired(true)),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        
        interaction.reply("");
	},
};