const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: "avatar",
  description: "Shows the mentioned user's avatar",
  async execute(client, message, args) {
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
      console.log(message.mentions);
    } else {
      user = message.author;
      console.log(message.author);
    }
    console.log(args);
    const avatarEmbed = new MessageEmbed()
      .setColor(0x333333)
      .setAuthor(user.username)
      .setImage(user.displayAvatarURL());
    message.channel.send({ embeds: [avatarEmbed] });
  },
};
