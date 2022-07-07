const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: "userinfo",
  description: "Shows mentioned user's info",
  async execute(client, message) {
    let user, member;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      return message.reply({ content: "Please mention a user!" });
    }

    member = message.guild.members.cache.get(user.id);
    if (!user.bot) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${user.username}#${user.discriminator}`)
        .addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : "Null"}`, true)
        .addField("Created at:", `${user.createdAt.toLocaleString()}`, true)
        .addField("Joined at", `${member.joinedAt.toLocaleString()}`, true)
        .addField("Roles:", `${member.roles.cache.map((role) => role.toString()).join(", ")}`, true);
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply({ content: "User is bot" });
    }
  },
};
