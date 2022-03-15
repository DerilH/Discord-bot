const { Interaction } = require('discord.js');
const EventEmitter = require('events');

class BotErrorEmitter extends EventEmitter
{
    #currentInteraction;
    constructor(bot)
    {
        super();
        this.bot = bot
        this.on('interactionError', message => {
            if(!this.#currentInteraction) return;
            this.#currentInteraction.reply(message);
            console.error = () => {};
            throw message;
        })
    }
    
    setInteraction(interaction) 
    {
        if(!(interaction instanceof Interaction)) throw new Error('Object is not Interaction');
        this.#currentInteraction = interaction;
    }
}
module.exports.BotErrorEmitter = BotErrorEmitter;