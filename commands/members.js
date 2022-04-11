module.exports = {
    name: 'members',
    aliases: 'members',
    description: 'Showes how many members on your server',
    async execute(client, message) {
        message.reply(`Members :  ` + message.guild.memberCount)
        console.log('Members : ' + message.guild.memberCount + '  (' + message.guild.name + ')')
    }
}