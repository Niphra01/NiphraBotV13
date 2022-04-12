const discord = require("discord.js");
module.exports = {
    name: "ban",
    aliases: 'ban',
    description: "Kullanıcıyı yasaklar",
    async execute(client, message, args, ops) {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You don't have this permission!");
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.ban().then(() => {
                    message.reply(`${user.tag} banned.`);
                }).catch(err => {
                    message.reply("You don't have this permission!");
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