const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { DBManager } = require('../../DBManager');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('temporarychannels')
        .setDescription('Choose temporary channels state')
        .addSubcommand(subcommand => {return subcommand
            .setName('enable')
            .setDescription('Enable temporary channels')
            .addStringOption(option => {return option
                .setName('categoryname')
                .setDescription('The name of temporary channels category')
                .setRequired(false);
            })
            .addStringOption(option => {return option
                .setName('creatorchannelname')
                .setDescription('The name of temporary channels creator channel')
                .setRequired(false);
            })
        })
        .addSubcommand(subcommand => {return subcommand
            .setName('disable')
            .setDescription('Disable temporary channels')
        })
        .setDefaultPermission(false),
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const state = interaction.options.getString('state');
        const categoryname = interaction.options.getString('categoryname');
        const creatorchannelname = interaction.options.getString('creatorchannelname');
        const subcommand = interaction.options.getSubcommand();

        if(subcommand == 'enable' ) {
            await guild.channel.temporaryChannels.enable(categoryname, creatorchannelname);

            interaction.reply('Temporary channels enabled');
        } else if(subcommand == 'disable') {
            await guild.channel.temporaryChannels.disable();
            
            interaction.reply('Temporary channels disabled');
        } else await interaction.reply("Invalid option");
    }
};