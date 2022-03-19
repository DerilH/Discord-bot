const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource } = require('@discordjs/voice');
const { Permissions } = require('discord.js');
const play = require('play-dl');
const { Song } = require('../../Music/Song');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays the specified song')
    .addStringOption(option => option.setName('url')
      .setDescription('Song url')
      .setRequired(true))
    .setDefaultPermission(true),
  permissions: [Permissions.FLAGS.SEND_MESSAGES],
  async execute(interaction, bot) {
    const guild = bot.getGuild(interaction.guild.id);
    const url = interaction.options.getString('url');
    await interaction.deferReply();

    const connection = guild.voice.connection;
    if (!guild.voice.connected) guild.voice.connect(interaction.member.voice.channel.id);

    const song = await getSong(url);
    guild.music.addToQueue(song);

    await interaction.editReply({ embeds: [createEmbed(song, guild)] });
  },
};

async function getSong(url) {
    let song;
    let videoInfo;
    if (play.yt_validate(url) === 'video') {
      await play.video_info(url).then(data => {
        videoInfo = data.video_details;
      });

      const stream = await play.stream(url, { discordPlayerCompatibility: true, quality: 0 });
      song = new Song(videoInfo, stream.stream);
    } else {
      videoInfo = await play.search(url, { limit: 1 });
      if (!videoInfo[0]) {
        await interaction.reply("Can not find song");
        return;
      }
      videoInfo = videoInfo[0];
      //console.log(videoInfo);
      const stream = await play.stream(videoInfo.url, { discordPlayerCompatibility: true, quality: 0 });
      song = new Song(videoInfo, stream.stream);
    }
  return song;
}

function createEmbed(song, guild) {
  const playMessageEmbed = {
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

  playMessageEmbed.title = song.info.title;
  playMessageEmbed.url = song.info.url;
  playMessageEmbed.thumbnail.url = song.info.thumbnails[0].url;
  playMessageEmbed.fields[0].value = song.info.channel.name;
  playMessageEmbed.fields[1].value = song.info.durationRaw;
  playMessageEmbed.fields[2].value = guild.music.estimatedTime;
  playMessageEmbed.fields[3].value = guild.music.songQueue.position(song).toString();
  return playMessageEmbed;
}