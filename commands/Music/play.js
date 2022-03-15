const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource } = require('@discordjs/voice');
const play = require('play-dl');
const { Song } = require('../../Music/Song');

const playMessageEmbed =  {
    "title": "Song_title",
    "color": 5719,
    "url": "http://www.youtube.com",
    "author": {
      "name": "Added to queue"
    },
    "thumbnail": {
      "url": "1"
    },
    "fields": [
      {
        "name": "Channel",
        "value": "1",
        "inline": true
      },
      {
        "name": "Song duration",
        "value": "1",
        "inline": true
      },
      {
        "name": "Estimated time until playing",
        "value": "1",
        "inline": true
      },
      {
        "name": "Position in queue",
        "value": "1",
        "inline": "false"
      }
    ]
  };

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the specified song')
        .addStringOption(option => option.setName('url')
            .setDescription('Song url')
            .setRequired(true)),
    async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        const url = interaction.options.getString('url');

        const connection = guild.voice.connection;
        if (typeof connection === 'string') guild.voice.connect(interaction.member.voice.channel.id);

        let videoInfo;
        let resource;

        if (play.yt_validate(url) === 'video') {
            await play.video_info(url).then(data => {
                videoInfo = data.video_details;
            });

            const stream = await play.stream(url, { discordPlayerCompatibility: true, quality: 2 });
            resource = createAudioResource(stream.stream, { inlineVolume: true, });
        } else {
            videoInfo = await play.search(url, { limit: 1 });
            if (!videoInfo[0]) {
                await interaction.reply("Can not find song");
                return;
            }
            videoInfo = videoInfo[0];
            let stream = await play.stream(videoInfo.url, { discordPlayerCompatibility: true, quality: 2 });
            resource = createAudioResource(stream.stream, { inlineVolume: true, });
        }

        const song = new Song(videoInfo, resource);
        guild.music.addToQueue(song);

        playMessageEmbed.title = videoInfo.title;
        playMessageEmbed.url = videoInfo.url;
        playMessageEmbed.thumbnail.url = videoInfo.thumbnails[0].url;
        playMessageEmbed.fields[0].value = videoInfo.channel.name;
        playMessageEmbed.fields[1].value = videoInfo.durationRaw;
        playMessageEmbed.fields[2].value = guild.music.estimatedTime;
        playMessageEmbed.fields[3].value = guild.music.songQueue.position(song).toString();
        await interaction.reply({embeds: [playMessageEmbed]});
    },
};