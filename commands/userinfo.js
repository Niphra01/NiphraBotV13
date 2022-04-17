const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "userinfo",
  aliases: ":page_facing_up: userinfo",
  description: "Shows the mentioned user's info",
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
    const member = message.guild.members.cache.get(user.id);
    if (!user.bot) {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${user.username}#${user.discriminator}`)
        .addField(
          "Nickname:",
          `${member.nickname !== null ? `${member.nickname}` : "Null"}`,
          true
        )
        .addField("Created at:", `${user.createdAt.toLocaleString()}`, true)
        .addField("Joined at", `${member.joinedAt.toLocaleString()}`, true)
        .addField(
          "Roles:",
          `${member.roles.cache.map((role) => role.toString()).join(", ")}`,
          true
        );
      message.channel.send({ embeds: [embed] });
    } else {
      message.reply("User is bot");
    }
  },
};
