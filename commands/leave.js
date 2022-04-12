module.exports = {
    name: "leave",
    aliases: 'leave',
    description: "Botun kanaldan ayrılmasını sağlar",
    async execute(client, message, args) {
        if (!message.member.voice.channel) return
        message.guild.me.voice.channel.leave()
        message.channel.send('Left the voicechannel')
    }

}