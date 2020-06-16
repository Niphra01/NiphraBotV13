const discord = require("discord.js");
module.exports = {
    name: "ban",
    aliases: 'ban',
    description: "Kullanıcıyı yasaklar",
    async execute(client, message, args, ops) {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("Bu yetkiye sahip değilsiniz!");
        const user = message.mentions.users.first();
        if (user) {
            const member = message.guild.member(user);
            if (member) {
                member.ban("Banlandıysan Niphra ile iletişime geç").then(() => {
                    message.reply(`${user.tag} banlandı.`);
                }).catch(err => {
                    message.reply("Sen kim köpek bu üyeyi banlamaya çalışmak.");
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