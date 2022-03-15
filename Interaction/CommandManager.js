const { BaseClient } = require("../BaseClient");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection } = require("discord.js");
const fs = require('node:fs');

class CommandManager extends BaseClient {

    constructor(client, bot) {
        super(client, bot);

        this.Rest = new REST({ version: '9' }).setToken(bot.token);
    }

    loadCommands(path) {
        this.client.commands = new Collection();
        this.commands = [];
        this.currentPath = path;

        let commandFiles = new Array();
        const commandDirs = fs.readdirSync(path).filter(file => {
            if(file.endsWith('.js')) 
            {
                commandFiles.push(file);
                return false;
            } else return true;
        })

        commandDirs.forEach(dir => {
            let currentFiles = fs.readdirSync(path + "/" + dir + "/").filter(file => file.endsWith('.js'));
            currentFiles.forEach((file, index) => 
            {
                currentFiles[index] = dir + '/' + file;
            });
            commandFiles = commandFiles.concat(currentFiles);
        });

        console.log("Commands loaded: ");
        console.log(commandFiles);

        for (const file of commandFiles) {
            const command = require(path + `/${file}`);

            this.commands.push(command.data.toJSON());
            this.client.commands.set(command.data.name, command);
        }
    }

    deployCommandsLocal(guildId) {
        this.deleteCommandsLocal(guildId);
        this.Rest.put(Routes.applicationGuildCommands(this.bot.clientId.toString(), guildId.toString()), { body: this.commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(function (reason) {
                console.log(reason);
            });
    }

    deployCommandsGlobal() {
        this.Rest.put(
            Routes.applicationCommands(this.bot.clientId.toString()),
            { body: this.commands },
        ).then(() => console.log("Successfully registered application commands.")).catch(console.error);
    }

    deleteCommandsLocal(guildId) {
        this.Rest.get(Routes.applicationGuildCommands(this.bot.clientId.toString(), guildId.toString()))
            .then(data => {
                const promises = [];
                for (const command of data) {
                    const deleteUrl = `${Routes.applicationGuildCommands(this.bot.clientId.toString(), guildId.toString())}/${command.id}`;
                    promises.push(this.Rest.delete(deleteUrl));
                }
                return Promise.all(promises);
            });
    }

    deleteCommandsGlobal() {
        this.Rest.get(Routes.applicationCommands(this.bot.clientId.toString()))
            .then(data => {
                const promises = [];
                for (const command of data) {
                    const deleteUrl = `${Routes.applicationCommands(this.bot.clientId.toString())}/${command.id}`;
                    promises.push(rest.delete(deleteUrl));
                }
                console.log("Commands succesfully deleted")
                return Promise.all(promises);
            });
    }
}
module.exports.CommandManager = CommandManager;