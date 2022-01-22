const discord = require("discord.js");
module.exports = {
    name: "mute",
    aliases: ':mute: mute',
    description: "Belirtilen kullanıcının sesini kapatır",
    async execute(client, message, args, ops) {

        //if (message.author.id === "141311627373969408") return message.reply("Sadece 'SEN' bu yetkiyi kullanamazsın.");
        if (!args[0]) return message.reply('Lütfen kullanıcıyı belirtiniz. Örnek: n!mute <@NiphraBOT>')
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Bu yetkiye sahip değilsiniz!");
       
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.members.cache.get(user.id);
                if (member) {
                    if (member.voice.channel) {
                        member.voice.setDeaf(true);
                        member.voice.setMute(true);
                        message.channel.bulkDelete(1);
						console.log(`${user.username} mutelendi`)
                    } else { message.reply("Üye sesli bir kanalda değil.") }

                } else {
                    message.reply("Sunucuda böyle bir üye yok.");
                }
            }
            else {
                message.reply("Sunucuda böyle bir üye yok.");
            }
        
    }

}
