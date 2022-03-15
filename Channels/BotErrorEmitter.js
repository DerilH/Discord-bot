const EventEmitter = require('events');

class BotErrorEmitter extends EventEmitter
{
    constructor(bot)
    {
        super();
        this.bot = bot
    }
}
module.exports.BotErrorEmitter = BotErrorEmitter;