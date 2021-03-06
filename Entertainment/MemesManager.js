const { BaseManager } = require("../BaseManager");
const randomMemes = require("something-random-on-discord").Random

class MemesManager extends BaseManager {

    constructor(client, bot, guild) {
        super(client, bot, guild);
    }

    async randomMeme(){
        return await randomMemes.getMeme();
    }

    async randomAdvice(){
        return await randomMemes.getAdvice();
    }

    async randomNeko(){
        return await randomMemes.getNeko();
    }
    
    async randomJoke(){
        return await randomMemes.getRandomJoke();
    }

    async randomAnimeImg(type) {
        return await randomMemes.getAnimeImgURL(type);
    }

    async randomFact(){
        return await randomMemes.getFact();
    }
}
module.exports.MemesManager = MemesManager;