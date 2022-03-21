const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('moderation')
        .setDescription('Moderation actions')
        .addSubcommand(subcommand => {
            return subcommand
                .setName('clear')
                .setDescription('Clear messages in current channel')
                .addIntegerOption(option => {
                    return option
                        .setName('number')
                        .setDescription('Number of messages to delete')
                        .setRequired(true);
                })
        })
        .addSubcommand(subcommand => {
            return subcommand
                .setName('tempban')
                .setDescription('Temporary ban user')
                .addUserOption(option => {
                    return option
                        .setName('user')
                        .setDescription('User to ban')
                        .setRequired(true);
                })
                .addStringOption(option => {
                    return option
                        .setName('time')
                        .setDescription('Time in dd:hh:mm format')
                        .setRequired(true);
                })
        })
        .setDefaultPermission(false),
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'clear':
                const number = interaction.options.getInteger('number');
                guild.moderation.clear(interaction.channel, number);

                interaction.reply({content:`${number} messages deleted`, ephemeral: true});
                return;
            case 'tempban':
                const user = interaction.options.getMember('user');
                const time = interaction.options.getString('time');
                guild.moderation.bans.tempBan(user.id, time);
                interaction.reply(`${user.displayName} banned`);
                return;
        }
    },
};