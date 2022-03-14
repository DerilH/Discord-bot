const { BaseClient } = require("discord.js");

class BaseManager extends BaseClient
{
    constructor(client, bot, guild) 
    {
        super(client, bot);
        this.guild = guild; 
    }
}
module.exports.BaseManager = BaseManager;