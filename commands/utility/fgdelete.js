const { SlashCommandBuilder } = require('discord.js');
const Mongo = require("../../src/configs/DbConfig");
const channelColl = Mongo.dbo.collection("FreegamesChannel");


module.exports = {
    data: new SlashCommandBuilder()
        .setName('fgdelete')
        .setDescription('Adding your channel to Database for free games!'),
    category: 'utility',
    async execute(interaction) {
        try {
            await Mongo.mongoClient.connect();
            await channelColl.deleteMany( {mGuildId:`${interaction.guildId}`,mChannelId:`${interaction.channelId}`} );
            await interaction.reply({content:`Channel is deleted from Database. You'll not get Free Game post anymore on this channel.`,ephemeral:true})
            await Mongo.mongoClient.close();
        } catch (err) { 
            logger.error(`Something went wrong when adding channel to the collection.`,err)
        }
    },
};
