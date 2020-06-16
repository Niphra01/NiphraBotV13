const discord = require("discord.js");
module.exports = {
  name: "sil",
  aliases: ':recycle: sil',
  description: "Girilen değer kadar mesajları siler.(14 günden önceki mesajlar silinmez)",
  async execute(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("Bu yetkiye sahip değilsiniz!");
    if (!args[0]) return message.channel.send("Değer giriniz.");
    try {
      message.channel.bulkDelete(parseInt(args[0]) + 1).then(() => {
        message.channel.send(`${args[0]} mesaj silindi.`).then(message => message.delete({ timeout: 5000 }));
      }).catch(err => {
        console.log('14 günden önceki mesaj silinmeye çalışıldı')
      });
    } catch (err) {
      message.reply("14 günden önceki mesajları silemessin");
      console.log('14 günden önceki mesaj silinmeye çalışıldı')
    }
  }
}