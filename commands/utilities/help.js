const { EmbedBuilder } = require("discord.js");
const Mongo = require("../../src/configs/DbConfig");
require("dotenv").config();
module.exports = {
  name: "help",
  aliases: "help",
  description: "Info about commands",
  async execute(client, message) {
    await Mongo.mongoClient.connect();
    const gPrefix = await Mongo.dbo
      .collection("BotEnv")
      .distinct("GuildPrefix", { GuildID: message.guild.id });
    await Mongo.mongoClient.close();
    let PREFIX;
    if (gPrefix.length === 0) {
      PREFIX = process.env.PREFIX;
    } else {
      PREFIX = gPrefix;
    }

    const helpEmbed = new EmbedBuilder()
      .setTitle("Commands")
      .setDescription(`GUILD PREFIX: **${PREFIX}**`)
      .setFooter({ text: `Example ${PREFIX}userinfo @user` });
    message.client.commands.each((cmd) => {
      helpEmbed.addFields([
        {
          name: `**${
            cmd.aliases
              ? `${PREFIX}${cmd.aliases.toUpperCase()}`
              : `${PREFIX}${cmd.name.toUpperCase()}`
          }**`,
          value: `${cmd.description}`,
        },
      ]);
    });
    helpEmbed.setTimestamp();
    message.author
      .send({ embeds: [helpEmbed] })
      .catch((err) =>
        message.channel.send(
          `Cannot send DM to you either blocked me or DM's off`
        )
      );
  },
};
