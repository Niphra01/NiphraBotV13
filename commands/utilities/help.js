const { MessageEmbed } = require("discord.js");
const Mongo = require('../../src/dbServer')
require("dotenv").config();
module.exports = {
  name: "help",
  aliases: ":page_facing_up: help",
  description: "Info about commands",
  async execute(client, message) {

    await Mongo.mongoClient.connect()
    const gPrefix = await Mongo.dbo
      .collection("BotEnv").distinct("GuildPrefix", { GuildID: message.guild.id });
    await Mongo.mongoClient.close()
    let PREFIX;
    if (gPrefix.length === 0) {
      PREFIX = process.env.PREFIX
    }
    else {
      PREFIX = gPrefix;
    }

    const helpEmbed = new MessageEmbed()
      .setTitle("Commands")
      .setDescription(`PREFIX: ${PREFIX}`)
      .setFooter({ text: `Example ${PREFIX}userinfo @user` });
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
