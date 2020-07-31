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

        const filter = (reaction, user) => ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;

        const AvatarEmbed = new Discord.MessageEmbed()
            .setTitle('Resim Boyutu')
            .setDescription(`
        
        1️⃣ Büyük
        2️⃣ Orta
        3️⃣ Orjinal
        `)
            .setColor(0xdd9323)
            .setFooter(`ID: ${message.author.id}`);

        message.channel.send(AvatarEmbed).then(async msg => {

            await msg.react('1️⃣');
            await msg.react('2️⃣');
            await msg.react('3️⃣');

            msg.awaitReactions(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async collected => {

                const reaction = collected.first();
                switch (reaction.emoji.name) {
                    case '1️⃣':
                        console.log('çalışıyor')
                        var canvas = Canvas.createCanvas(500, 500);
                        var ctx = canvas.getContext('2d');

                        var background = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                        ctx.strokeStyle = '#74037b';
                        ctx.strokeRect(0, 0, canvas.width, canvas.height);
                        var attachment = new Discord.MessageAttachment(canvas.toBuffer());

                        message.channel.send(attachment);
                        break;
                    case '2️⃣':
                        var canvas = Canvas.createCanvas(250, 250);
                        var ctx = canvas.getContext('2d');

                        var background = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                        ctx.strokeStyle = '#74037b';
                        ctx.strokeRect(0, 0, canvas.width, canvas.height);
                        var attachment = new Discord.MessageAttachment(canvas.toBuffer());

                        message.channel.send(attachment);
                        break;
                    case '3️⃣':
                        const avatarEmbed = new Discord.MessageEmbed()
                            .setColor(0x333333)
                            .setAuthor(user.username)
                            .setImage(user.displayAvatarURL());
                        message.channel.send(avatarEmbed);
                        break;
                }
            }).catch(collected => {
                return message.channel.send(`Bir sorun oluştu`);
            });

        });
    }
}