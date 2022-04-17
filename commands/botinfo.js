const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "botinfo",
  aliases: ":page_facing_up: botinfo",
  description: "Shows the Bot info",
  async execute(client, message) {
    let boticon = client.user.displayAvatarURL();
    const botembed = new MessageEmbed()
      .setColor("0ED4DA")
      .setThumbnail(boticon)
      .setTitle(`${client.user.username}`)
      .addField(
        "Developer",
        client.users.cache.get("201652761031475200").toString()
      )
      .addField("Created at", client.user.createdAt.toString())
      .addField("Servers", client.guilds.cache.size.toString());

    message.channel.send({ embeds: [botembed] });
  },
};
