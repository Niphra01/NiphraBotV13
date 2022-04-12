const discord = require("discord.js");
module.exports = {
    name: "kick",
    aliases: 'kick',
    description: "Kullanıcıyı atar",
    async execute(client, message, args, ops) {
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You don't have this permission!");
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.kick().then(() => {
                    message.reply(`${user.tag} kicked.`);
                }).catch(err => {
                    message.reply("You can't kick this user");
                    console.log(err);
                })
            } else {
                message.reply("This user is not in this server.");
            }
        }
        else {
            message.reply("This user is not in this server.");
        }
    }
}