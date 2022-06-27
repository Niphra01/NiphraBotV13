const Mongo = require("../../src/dbServer");

module.exports = {
    name: "setprefix",
    aliases: 'setprefix',
    description: 'Changes prefix',
    async execute(client, message, args) {
        await Mongo.mongoClient.connect();

        const getGuildID = message.guild.id;
        const getGuildName = message.guild.name;

        const findResult = await Mongo.dbo
            .collection("BotEnv")
            .find({})
            .toArray();

        if (findResult.some((item) => item.GuildID.includes(getGuildID))) {
            await Mongo.dbo.collection("BotEnv").updateOne({ GuildID: getGuildID }, { $set: { GuildPrefix: args[0] } });
            message.channel.send(`Prefix was set to: **${args[0]}**`)
        }
        else {
            await Mongo.dbo.collection("BotEnv").insertMany([
                {
                    GuildID: getGuildID,
                    GuildName: getGuildName,
                    GuildPrefix: args[0],
                },
            ]);
            message.channel.send(`Prefix was set to: **${args[0]}**`)
        }
        await Mongo.mongoClient.close();
    }
}