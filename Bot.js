const { getVoiceConnection } = require('@discordjs/voice');
const { Client, Intents } = require('discord.js');
const { CmdCommandHandler } = require('./Interaction/CmdCommandHandler');
const { CommandManager } = require('./Interaction/CommandManager');
const { GuildManager } = require('./GuildManager');
const { DBManager } = require('./DBManager');

class Bot {
    #cmdHandler
    #guilds = {};
    constructor(token, clientId, commandsPath, databasePath) {
        this.token = token;
        this.clientId = clientId;

        this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

        this.#cmdHandler = new CmdCommandHandler(this);
        this.commandManager = new CommandManager(this.client, this, commandsPath);
        this.commandManager.loadCommands();
        this.dbManager = new DBManager(this.client, this, databasePath);

        this.#setEvents();
    }

    getGuild(guildId) {
        return this.#guilds[guildId];
    }

    #setEvents() {
        this.client.once('ready', () => {

            const guilds = Array.from(this.client.guilds.cache.values());
            guilds.forEach(async element => {
                this.#guilds[element.id] = new GuildManager(this.client, this, element);
                await this.#guilds[element.id].channel.temporaryChannels.selfLoad();
                await this.#guilds[element.id].moderation.bans.selfLoad();
            });
            console.log('Ready!');
        });

        this.client.on('interactionCreate', async interaction => {
            const errorMethod = console.error;
            try {
                if (!interaction.isCommand()) return;

                const guild = this.getGuild(interaction.guild.id);
                guild.errorEmitter.setInteraction(interaction);

                const command = this.client.commands.get(interaction.commandName);

                if (!command) return;

                await command.execute(interaction, this);
                guild.errorEmitter.setInteraction(undefined);
            } catch (error) {
                console.error = errorMethod;
            }
        });

        this.client.on('voiceStateUpdate', async (oldState, newState) => {
            const guild = this.getGuild(newState.guild.id);

            if (guild.channel.temporaryChannels.enabled) {
                guild.channel.temporaryChannels.handle(oldState, newState);
            }
        })

        this.client.on('guildCreate', guild => {
            this.#guilds[guild.id] = new GuildManager(this.client, this, element);
        });
        this.client.on('guildDelete', guild => {
            delete this.#guilds[guild.id];
        });

        process.on('exit', () => {
            this.shutdown();
        })
    }

    login() {
        this.client.login(this.token);
    }

    shutdown() {
        for (const [key, value] of Object.entries(this.#guilds)) {
            const connection = getVoiceConnection(value.id);
            if (connection) {
                connection.destroy();
            }
        }
        console.log('Goodbye!')
    }
}
module.exports.Bot = Bot;