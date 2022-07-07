const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "botinfo",
  aliases: "botinfo",
  description: "Shows Bot info",
  async execute(client, message) {
    let botIcon = client.user.displayAvatarURL();
    const botEmbed = new MessageEmbed()
      .setColor("0ED4DA")
      .setThumbnail(botIcon)
      .setTitle(`${client.user.username}`)
      .addField(
        "Developer",
        client.users.cache.get("201652761031475200").toString()
      )
      .addField("Created at", client.user.createdAt.toString())
      .addField("Servers", client.guilds.cache.size.toString());

    message.channel.send({ embeds: [botEmbed] });
  },
};
