

const Discord = new require('discord.js');
const relicConfig = require("../warframe/relicLocation.json");

module.exports = {
    name: 'relics',
    aliases: 'relics',
    description: 'Relik`lerin bilgilerini gösterir',
    async execute(client, message, args, ops) {
        const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣',].includes(reaction.emoji.name) && user.id === message.author.id;

    const locEmbed = new Discord.MessageEmbed()
        .setTitle(`${relicConfig.Lith.name.C6}`)
        .addFields(
            {name:`Drop Location`,value:`${relicConfig.Lith.location.C6}`},
            {name:`Inside Drop`,value:`${relicConfig.Lith.drops.C6}`,inline:true}
        )
         

            message.channel.send(locEmbed);
}
}