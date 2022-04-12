const discord = require("discord.js");
module.exports = {
  name: "delete",
  aliases: ':recycle: delete',
  description: "Girilen değer kadar mesajları siler.(14 günden önceki mesajlar silinmez)",
  async execute(client, message, args) {
    if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.reply("You don't have this permission!");
    if (!args[0]) return message.channel.send("Set how many messages do you want to delete. Example <-delete 5>");
    try {
      message.channel.bulkDelete(parseInt(args[0]) + 1).then(() => {
        message.channel.send(`${args[0]} message deleted.`).then(message => message.delete({ timeout: 5000 }));
      }).catch(err => {
        console.log('Discord 14 days thingy')
        message.reply("Can't delete 14 days older messages");
      });
    } catch (err) {
      message.reply("Can't delete 14 days older messages");
      console.log('Discord 14 days thingy')
    }
  }
}