const Discord = require("discord.js");

module.exports = {
    name: ("userinfo"),
    aliases: (':page_facing_up: userinfo'),
    description: ("Belirtilen kullanıcın bilgilerini gösterir"),
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
        const member = message.guild.members.cache.get(user.id);
        if (!user.bot) {
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setThumbnail(user.displayAvatarURL())
                .setTitle(`${user.username}#${user.discriminator}`)
                .addField("Takma Adı:", `${member.nickname !== null ? `${member.nickname}` : 'Yok'}`, true)
                .addField("Oluşturulma Tarihi:", `${user.createdAt.toLocaleString()}`, true)
                .addField('Sunucuya Katılma tarihi', `${member.joinedAt.toLocaleString()}`, true)
                .addField("Rolleri:", `${member.roles.cache.map(role => role.toString()).join(', ')}`, true)
            message.channel.send({ embeds: [embed] });
        } else {
            message.reply('Kullanıcı bir Bot')
        }


    }
}