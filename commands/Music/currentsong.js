const { SlashCommandBuilder } = require('@discordjs/builders');
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
		.setName('currentsong')
		.setDescription("Shows currently playing song!"),
	async execute(interaction, bot) {
        const guild = bot.getGuild(interaction.guild.id);
        
        if (guild.music.playing == false) {
            interaction.reply("No song is playing now");
            return;
        }

        const videoInfo = guild.music.songQueue.current.info;

        playMessageEmbed.title = videoInfo.title;
        playMessageEmbed.url = videoInfo.url;
        playMessageEmbed.thumbnail.url = videoInfo.thumbnails[0].url;
        playMessageEmbed.fields[0].value = videoInfo.channel.name;
        playMessageEmbed.fields[1].value = videoInfo.durationRaw;
        playMessageEmbed.fields[2].value = guild.music.estimatedTime;
        playMessageEmbed.fields[3].value = guild.music.songQueue.position(guild.music.songQueue.current).toString();
        
        await interaction.reply({embeds: [playMessageEmbed]});
	},
};