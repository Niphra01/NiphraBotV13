const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "botinfo",
  aliases: "botinfo",
  description: "Shows Bot info",
  async execute(client, message) {
    let botIcon = client.user.displayAvatarURL();
    const botEmbed = new EmbedBuilder()
      .setColor("0ED4DA")
      .setThumbnail(botIcon)
      .setTitle(`${client.user.username}`)
      .addFields([
        {
          name: "Developer",
          value: client.users.cache.get("201652761031475200").toString(),
        },
        { name: "Created at", value: client.user.createdAt.toString() },
        { name: "Servers", value: client.guilds.cache.size.toString() },
      ]);
    message.channel.send({ embeds: [botEmbed] });
  },
};
