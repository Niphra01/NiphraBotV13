const Discord = require("discord.js");
const Canvas = require('canvas');

module.exports = {
    name: "avatar",
    aliases: "avatar",
    description: "Avatar'ını gösterir",
    async execute(client, message, args, ops) {
        let user;
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
            console.log(message.mentions)
        }
        else {
            user = message.author;
            console.log(message.author)
        }
        console.log(args)
        const avatarEmbed = new Discord.MessageEmbed()
            .setColor(0x333333)
            .setAuthor(user.username)
            .setImage(user.displayAvatarURL());
        message.channel.send({ embeds: [avatarEmbed] });

    }
}