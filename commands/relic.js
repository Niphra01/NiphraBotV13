

const Discord = new require('discord.js');
const relicConfig = require("../warframe/relicsInfo.json");

module.exports = {
    name: 'relic',
    aliases: 'relic',
    description: 'Relic`lerin bilgilerini gösterir',
    async execute(client, message, args, ops) {
      try{
            console.log('' + relicConfig[args[0].toUpperCase()].drops[args[1].toUpperCase()])
            const relicEmbed = new Discord.MessageEmbed()
                .setTitle(`${args[0].toUpperCase()} ` + ` ${relicConfig[args[0].toUpperCase()].name[args[1].toUpperCase()]}`)
                .addFields(
                    { name: `Best Drop Location`, value: `${relicConfig[args[0].toUpperCase()].location[args[1].toUpperCase()]}` },
                    { name: `Inside Drop`, value: `${relicConfig[args[0].toUpperCase()].drops[args[1].toUpperCase()]}`, inline: true }
                )


            message.channel.send(relicEmbed);
        }catch(err){
            message.channel.send("Girdiğiniz relic Vault'ta veya böyle bir relic yok")
        }
    }
}