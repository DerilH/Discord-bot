const { BaseClient } = require("../BaseClient");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Collection, Permissions } = require("discord.js");
const fs = require('node:fs');
const { totalmem } = require("node:os");

class CommandManager extends BaseClient {

    constructor(client, bot) {
        super(client, bot);

        this.Rest = new REST({ version: '9' }).setToken(bot.token);
    }

    loadCommands(path) {
        this.client.commands = new Collection();
        this.commands = [];
        this.permissions = {};
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

    async deployCommandsLocal(guildId) {
        //this.deleteCommandsLocal(guildId);
        await this.Rest.put(Routes.applicationGuildCommands(this.bot.clientId.toString(), guildId.toString()), { body: this.commands })
            .then(() => console.log('Successfully registered application commands.'))
            .catch(function (reason) {
                console.log(reason);
            });
        //this.loadCommandPermissionsLocal(guildId);
    }

    async loadCommandPermissionsLocal(guildId){
        const guild = this.bot.getGuild(guildId).guild;
        const roles = Array.from(guild.roles.cache.values());

        const commandsCollection = await guild.commands.fetch();
        const guildCommands = Array.from(commandsCollection.values());
        const commands = this.client.commands;
        guildCommands.filter(element => commands.get(element.name).data.defaultPermission == false)
        .forEach(element => {
            const cmdRoles = roles.filter(role => {
                return role.permissions.has(commands.get(element.name).permissions);
            });

            const permissionTemplate =	{
                id: '',
                type: 'ROLE',
                permission: true,
            }
            const permissions = [];
            cmdRoles.forEach(role => {
                let permission = permissionTemplate;
                permission.id = role.id;
                permissions.push(permission);
            })
            element.permissions.set({permissions});
        })
        console.log("Permissions reloaded")
    }

    async loadCommandPermissionsGlobal(){
        const guilds = Array.from(await this.client.guilds.cache.values());

        const commandsCollection = await this.client.application.commands.fetch();
        const commands = this.client.commands;
        const globalCommands = Array.from(commandsCollection.values());

        let roles = [];
        guilds.forEach(guild => {
            roles.concat(Array.from(guild.roles.cache.values()));
        });

        globalCommands.filter(element => commands.get(element.name).data.defaultPermission == false)
        .forEach(element => {
            const cmdRoles = roles.filter(role => {
                return role.permissions.has(commands.get(element.name).permissions);
            });

            const permissionTemplate =	{
                id: '',
                type: 'ROLE',
                permission: true,
            }
            const permissions = [];
            cmdRoles.forEach(role => {
                let permission = permissionTemplate;
                permission.id = role.id;
                permissions.push(permission);
            })
            element.permissions.set({permissions});
        })
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