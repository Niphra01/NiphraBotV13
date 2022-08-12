const { EmbedBuilder } = require("discord.js");

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
      const embed = new EmbedBuilder()
        .setColor(0x333333)
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${user.username}#${user.discriminator}`)
        .addFields([
          {
            name: "Nickname",
            value: `${
              member.nickname !== null ? `${member.nickname}` : "Null"
            }`,
          },
          { name: "Created at", value: `${user.createdAt.toLocaleString()}` },
          { name: "Joined at", value: `${member.joinedAt.toLocaleString()}` },
          {
            name: "Roles",
            value: `${member.roles.cache
              .map((role) => role.toString())
              .join(", ")}`,
          },
        ]);
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply({ content: "User is bot" });
    }
  },
};
