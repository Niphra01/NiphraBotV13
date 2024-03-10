const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../src/configs/DbConfig");
const channelColl = Mongo.dbo.collection("FreegamesChannel");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgadd')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        console.log(interaction)
        try {
            await  Mongo.mongoClient.connect();
            await channelColl.insertMany([
                {
                    mGuildId: interaction.guildId,
                    mChannelId: interaction.channelId,
                }
            ])
            interaction.reply({content:'Channel added to database.',ephemeral:true})
            await  Mongo.mongoClient.close();
        } catch (err) { 
            interaction.reply({content:'Channel is already in database.',ephemeral:true})
            logger.error(`Something went wrong when adding channel to the collection.`,err)
        }
    },
};
