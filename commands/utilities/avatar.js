const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: "avatar",
  description: "Shows mentioned user's avatar",
  async execute(client, message, args) {
    let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      return message.reply({ content: "Please mention a user!" });
    }
    const avatarEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('Avatar Link')
      .setURL(`${user.displayAvatarURL()}?size=1024`)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setImage(`${user.displayAvatarURL()}?size=256`)
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
    message.channel.send({ embeds: [avatarEmbed] });
  },
};
