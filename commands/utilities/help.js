const { MessageEmbed } = require("discord.js");
require("dotenv").config();
module.exports = {
  name: "help",
  aliases: ":page_facing_up: help",
  description: "Info about commands",
  async execute(client, message) {
    const helpEmbed = new MessageEmbed()
      .setTitle("Commands")
      .setDescription(`PREFIX: ${process.env.PREFIX}`)
      .setFooter({ text: "Example -userinfo <@user>" });
    message.client.commands.each((cmd) => {
      helpEmbed.addField(
        `**${cmd.aliases ? `[${cmd.aliases}]` : ""}**`,
        `${cmd.description}`,
        true
      );
    });
    helpEmbed.setTimestamp();
    message.channel.send({ embeds: [helpEmbed] });
  },
};
