const { BaseManager } = require("./BaseManager");

class BanManager extends BaseManager{
    constructor(client, bot, guild){
        super(client, bot, guild)
        this.bannedUsers = [];
    }

    async selfLoad() {
        try {
            const exists = await this.bot.dbManager.guildExists(this.guild.id, 'bannedUsers');
            if (!exists) {
                return;
            }
            this.bannedUsers = await this.bot.dbManager.getAllBans(this.guild.id);
            this.bannedUsers.forEach(ban => {
                const time = this.getTimeToUnban(Date.parse(ban.endDate));
                if(time <= 0){
                    this.unban(ban.userId);
                    this.bannedUsers.splice(this.bannedUsers.indexOf(ban), 1);
                    return;
                }
                setTimeout(() => {
                    this.unban(ban.userId);
                }, this.getTimeToUnban(Date.Parse(ban.endDate)));
            })
        } catch (error) {
            console.error(error);
        }
    }

    getTimeToUnban(unBanDate){
        const currentDate = new Date();
        return unBanDate.getTime() - currentDate.getTime();
    }

    async tempBan(userId, time){
        const days = parseInt(time[0] + time[1]);
        const hourse = parseInt(time[3] + time[4]);
        const minutes = parseInt(time[6] + time[7]);
        const ms = (days * 24 * 60 * 60 * 1000) + (hourse * 60 * 60 * 1000) + (minutes * 60 * 1000);

        const endDate = new Date();
        endDate.setMilliseconds(endDate.getMilliseconds() + ms);

        if(isNaN(days) || isNaN(hourse) || isNaN(minutes) ){
            this.guild.errorEmitter.emit('interactionError', 'Invalid time format');
        }
        if(days > 10) {
            this.guild.errorEmitter.emit('interactionError', 'You can only ban user for 10 days');
        }

        
        
        await this.guild.guild.members.ban(userId);
        this.bot.dbManager.insertBan(userId, this.guild.id, endDate.toDateString());
        const ban = {guildId:this.guild.id, userId: userId, endDate: endDate.toDateString()};
        this.bannedUsers.push(ban)


        setTimeout(() => {
            this.unban(userId);
        }, ms)
    }

    async unban(userId){
        await this.guild.guild.members.unban(userId);
        const ban = this.bannedUsers.find(item => item.userId == userId);
        const index = this.bannedUsers.indexOf(ban);
        this.bannedUsers.splice(index, 1);
        await this.bot.dbManager.removeBan(userId, this.guild.id);
    }
}
module.exports.BanManager = BanManager;