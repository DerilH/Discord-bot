const { BaseManager } = require('../BaseManager');

class TikTokManager extends BaseManager{

    constructor(client, bot, guild){
        super(client, bot, guild)
    } 

} 
module.exports.TikTokManager = TikTokManager;