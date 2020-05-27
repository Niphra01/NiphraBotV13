const Discord = require("discord.js");

module.exports = {
    name: "botinfo",
    description: "Niphra tarafından oluşturuldu",
    async execute(client, message, args) {

        let boticon = client.user.displayAvatarURL();
        const botembed = new Discord.MessageEmbed() 
            .setColor("0ED4DA")
            .setThumbnail(boticon)
            .setTitle(`${client.user.username}`)
            .addField("Geliştiricisi", client.users.cache.get('201652761031475200'))
            .addField("Bot Oluşturulma Tarihi", client.user.createdAt)
            .addField("Sunucular", client.guilds.cache.size)

        message.channel.send(botembed)
    }


}