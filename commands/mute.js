const discord = require("discord.js");
module.exports = {
    name: "mute",
    description: "ses kapatır",
    async execute(client, message, args, ops) {

        //if (message.author.id === "141311627373969408") return message.reply("Sadece 'SEN' bu yetkiyi kullanamazsın.");
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Bu yetkiye sahip değilsiniz!");
        if (message.channel.id === '526541910685384704') {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.member(user);
                if (member) {
                    if (member.voice.channel) {
                        member.voice.setDeaf(true);
                        member.voice.setMute(true);
                        message.channel.bulkDelete(1);
                    } else { message.reply("Üye sesli bir kanalda değil.") }

                } else {
                    message.reply("Serverda böyle bir üye yok.");
                }
            }
            else {
                message.reply("Serverda böyle bir üye yok.");
            }
        }
        else {
            message.channel.send('bu komut sadece musicbot adlı kanalda çalışır')
        }
    }

}
