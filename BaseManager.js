const { BaseClient } = require("discord.js");

class BaseManager 
{
    constructor(client, bot, guild) 
    {
        this.client = client;
        this.bot = bot;
        this.guild = guild; 
    }
}
module.exports.BaseManager = BaseManager;