
const Discord = require('discord.js')
const snekfetch = require('snekfetch');
module.exports = {
    name: 'image',
    aliases: 'image',
    description: `Belirtilen subreddit'ten rastgele resim çeker`,
    async execute(client, message, args) {
        if (!message.member.permissions.has("ADMINISTRATOR")) return;
        var c = 0;
        var controlList = ['hentai', 'nsfw']
        const filter = (reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
        for (var i = 0; i < controlList.length; i++) {
            if (args[0].toLowerCase().includes(controlList[i])) {
                c = 1;
                const imageEmbed = new Discord.MessageEmbed()
                    .attachFiles(['./images/areyousure.png'])
                    .setImage('attachment://areyousure.png')
                    .setColor(0xdd9323)

                message.channel.send(imageEmbed).then(async msg => {
                    await msg.react('👍');
                    await msg.react('👎');

                    msg.awaitReactions(filter, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    }).then(async collected => {

                        const reaction = collected.first();
                        switch (reaction.emoji.name) {
                            case '👍':
                                var name = args[0].toLowerCase();
                                try {

                                    const { body } = await snekfetch
                                        .get(`https://www.reddit.com/r/${name}.json?sort=top&t=all`)
                                        .query({ limit: 800 });
                                    const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
                                    if (!allowed.length) return message.channel.send('Sorun oluştu. Sonra tekrar dene.');
                                    const randomnumber = Math.floor(Math.random() * allowed.length)
                                    if (allowed[randomnumber].data.url === null) return;
                                    const embed = new Discord.MessageEmbed()
                                        .setColor(0x00A2E8)
                                        .setImage(allowed[randomnumber].data.url)
                                        .setFooter(`Provided by r/${name}`)
                                    message.channel.send(embed)
                                } catch (err) {
                                    return console.log(err);
                                }
                                break;
                            case '👎':
                                undefined;
                                break;

                        }
                    }).catch(collected => {
                        return message.channel.send(`Bir sorun oluştu`);
                    });
                });
            }
        }

        if(c === 0){
        var name = args[0].toLowerCase();
        try {

            const { body } = await snekfetch
                .get(`https://www.reddit.com/r/${name}.json?sort=top&t=all`)
                .query({ limit: 800 });
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('Sorun oluştu. Sonra tekrar dene.');
            const randomnumber = Math.floor(Math.random() * allowed.length)
            if (allowed[randomnumber].data.url === null) return;
            const embed = new Discord.MessageEmbed()
                .setColor(0x00A2E8)
                .setImage(allowed[randomnumber].data.url)
                .setFooter(`Provided by r/${name}`)
            message.channel.send(embed)
        } catch (err) {
            return console.log(err);
        }

    }


    }
}