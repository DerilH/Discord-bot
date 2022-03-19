const { createAudioResource } = require('@discordjs/voice');
const {ReReadable} = require("rereadable-stream");

class Song
{
    constructor(info, stream)
    {
        this.info = info;
        this.stream = stream.pipe(new ReReadable());

    }

    get resource() {
        const stream = this.stream.rewind();
        let res = createAudioResource(stream, { inlineVolume: true, });
        return res;
    }
}
module.exports.Song = Song;