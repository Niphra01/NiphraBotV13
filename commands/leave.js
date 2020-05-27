module.exports = {
    name: "leave",
    description: "leave",
    async execute(client, message, args) {
        if(!message.member.voice.channel) return
        message.guild.me.voice.channel.leave()
        message.channel.send('Kanaldan Ayrıldı')
    }

}