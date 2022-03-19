const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Anime actions')
        .addSubcommand(subcommand => {
            return subcommand
                .setName('image')
                .setDescription('Finds random anime image by type')
                .addStringOption(option => {
                    return option
                        .setName('type')
                        .setDescription('type')
                        .addChoice('pat', 'pat')
                        .addChoice('cry', 'cry')
                        .addChoice('hug', 'hug')
                        .addChoice('waifu', 'waifu')
                        .addChoice('kiss', 'kiss')
                        .addChoice('slap', 'slap')
                        .addChoice('smug', 'smug')
                        .addChoice('punch', 'punch')
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName('neko')
                .setDescription('Finds random neko')
        })
        .setDefaultPermission(true),
    permissions: [Permissions.FLAGS.SEND_MESSAGES],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'image':
                const type = interaction.options.getString('type');
                const imageUrl = await guild.meme.randomAnimeImg(type);
                const embed = {
                    color: 'RANDOM',
                    image: { url: imageUrl },
                }
                interaction.reply({ embeds: [embed] });
                break;
            case 'neko':
                const neko = await guild.meme.randomNeko();
                interaction.reply({ embeds: [neko.embed] });
                break;
        }
    },
};