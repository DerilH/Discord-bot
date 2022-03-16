const { createAudioPlayer, NoSubscriberBehavior } = require("@discordjs/voice");
const { BaseManager } = require("../BaseManager");
const Queue = require("../utility/Queue");
const { Song } = require("./Song");


class MusicManager extends BaseManager {
    playing = false;
    constructor(client, bot, guild) {
        super(client, bot, guild);

        this.songQueue = new Queue();

        this.audioPlayer = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause, } });
        this.audioPlayer.on('stateChange', (oldState, newState) => {
            if (this.songQueue.empty)
            {
                this.playing = false;
                return;
            }
            if (oldState.status === 'playing' && newState.status === 'idle') {
                if(this.looped == true) 
                {
                    this.play(this.songQueue.current);
                } else {
                    this.nextInQueue(guild.id);
                }
            }
        });
    }

    get subscription() {
        const connection = this.guild.voice.connection;
        if (typeof connection === "string") return connection;

        const subscription = connection.state.subscription;
        return subscription;
    }

    get estimatedTime() {
        let fullDuration = 0;
        this.songQueue.arr.forEach(element => {

            let duration = element.info.durationInSec;
            fullDuration += duration;
        });
        let time = Math.floor(fullDuration / 60) + ":" + (fullDuration % 60);
        return time;
    }

    setVolume(volume) {
        const subscription = this.subscription;
        subscription.player.state.resource.volume.setVolume(volume / 100);
    }

    play(song) {
        if (song === undefined) return;
        const connection = this.guild.voice.connection;
        this.audioPlayer.play(song.resource);
        this.audioPlayer.on('error', err => {
            console.log(err.message);
        })

        connection.subscribe(this.audioPlayer);
        this.playing = true;
    }

    end() 
    {
        const connection = this.guild.voice.connection;
        this.audioPlayer.stop();
        this.subscription.unsubscribe();
        this.songQueue.clear();
    }

    skip() {
        if(this.playing == false) return;
        this.audioPlayer.stop();
        this.nextInQueue();
    }

    pause() {
        const subscription = this.subscription;
        subscription.player.pause();
    }

    unPause() {
        const subscription = this.subscription;
        subscription.player.unpause();
    }

    getQueue(guildId) {
        return this.songQueue;
    }

    addToQueue(song) {
        if (song instanceof Song) {
            if (!this.songQueue.empty) {
                this.songQueue.push(song);
            } else {
                this.songQueue.push(song);
                this.startQueue();
            }
        }
    }

    nextInQueue() {
        if (this.songQueue.empty) return;
        this.songQueue.next();
        this.play(this.songQueue.current);
    }

    startQueue() {
        if (this.songQueue.empty) return;
        this.play(this.songQueue.current);
    }


}
module.exports.MusicManager = MusicManager;