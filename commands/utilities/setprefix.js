const Mongo = require("../../src/configs/DbConfig");

module.exports = {
  name: "setprefix",
  aliases: "setprefix",
  description: "Changes prefix",
  async execute(client, message, args) {
    await Mongo.mongoClient.connect();
    if (args[0].length > 1)
      return message.reply({
        content: "**Please provide single digit Letter/Symbol/Number**",
      });

    const PREFIX = args[0].charAt(0);
    const getGuildID = message.guild.id;
    const getGuildName = message.guild.name;

    const findResult = await Mongo.dbo.collection("BotEnv").find({}).toArray();

    if (findResult.some((item) => item.GuildID.includes(getGuildID))) {
      await Mongo.dbo
        .collection("BotEnv")
        .updateOne({ GuildID: getGuildID }, { $set: { GuildPrefix: PREFIX } });
      message.reply({ content: `Prefix was set to: **${PREFIX}**` });
    } else {
      await Mongo.dbo.collection("BotEnv").insertMany([
        {
          GuildID: getGuildID,
          GuildName: getGuildName,
          GuildPrefix: PREFIX,
        },
      ]);
      message.reply({ content: `Prefix was set to: **${PREFIX}**` });
    }
    await Mongo.mongoClient.close();
  },
};
