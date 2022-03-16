const { createAudioResource } = require('@discordjs/voice');

class Song
{
    constructor(info, stream)
    {
        this.info = info;
        this.stream = stream;
    }

    get resource() {
        const res = createAudioResource(this.stream, { inlineVolume: true, });
        return res;
    }
}
module.exports.Song = Song;