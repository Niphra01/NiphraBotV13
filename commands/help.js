const discord = require('discord.js');

module.exports = {
    name: "help",
    description: "Niphra tarafından oluşturuldu",
    async execute(client, message, args) {
        const helpEmbed = new discord.MessageEmbed()
        .setTitle('Komutlar')
        .addFields(
            {name:'Müzik - 9', value:'play, loop, lyrics, np, pause, resume, queue, skip, stop'},
            {name:'Genel - 3', value:`hesap, botinfo, userinfo`},
            {name:'Admin - 5', value:'kick, ban, sil, mute, unmute'},
            )
        .setFooter('Örnek n!userinfo <@user>')

        message.channel.send(helpEmbed);
    }

}