
const Discord = require('discord.js')
const snekfetch = require('snekfetch');
module.exports = {
    name: 'reddit',
    aliases: 'reddit',
    description: `Belirtilen subreddit'ten rastgele resim çeker`,
    async execute(client, message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        var name = args[0].toLowerCase();
        try {

            const { body } = await snekfetch
                .get(`https://www.reddit.com/r/${name}.json?sort=top&t=all`)
                .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('Belirtilen subreddit için NSFW kanalı gerekli');
            const randomnumber = Math.floor(Math.random() * allowed.length)
            if (allowed[randomnumber].data.url === null) return;
            const embed = new Discord.MessageEmbed()
                .setColor(0x00A2E8)
                .setImage(allowed[randomnumber].data.url)
                .setFooter(`Provided by r/${name}`)
            message.channel.send({ embeds: [embed] })
        } catch (err) {
            return console.log(err);
        }


    }
}