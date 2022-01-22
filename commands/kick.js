const discord = require("discord.js");
module.exports = {
    name: "kick",
    aliases: 'kick',
    description: "Kullanıcıyı atar",
    async execute(client, message, args, ops) {
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Bu yetkiye sahip değilsiniz!");
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                member.kick("Hadi toprağım hadi bekleme yapma").then(() => {
                    message.reply(`${user.tag} atıldı.`);
                }).catch(err => {
                    message.reply("Sen kim köpek bu üyeyi atmaya çalışmak.");
                    console.log(err);
                })
            } else {
                message.reply("Serverda böyle bir üye yok.");
            }
        }
        else {
            message.reply("Serverda böyle bir üye yok.");
        }
    }
}