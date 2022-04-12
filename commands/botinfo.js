const Discord = require("discord.js");

module.exports = {
    name: "botinfo",
    aliases: ':page_facing_up: botinfo',
    description: "Bot bilgisini gösterir",
    async execute(client, message, args) {

        let boticon = client.user.displayAvatarURL();
        const botembed = new Discord.MessageEmbed()
            .setColor("0ED4DA")
            .setThumbnail(boticon)
            .setTitle(`${client.user.username}`)
            .addField("Developer", client.users.cache.get('201652761031475200').toString())
            .addField("Created at", client.user.createdAt.toString())
            .addField("Servers", client.guilds.cache.size.toString())

        message.channel.send({ embeds: [botembed] })
    }


}