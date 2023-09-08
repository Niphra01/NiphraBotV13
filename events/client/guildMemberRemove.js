const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            member.guild.channels.cache
                .get("617071160957337638")
                .send("**" + member.user.username + "**, ayrıldı.");
        }
        catch (err) {
            console.log(err);
        }
    }
};