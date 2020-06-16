module.exports = {
  name: "np",
  aliases: 'np',
  description: "O an çalan şarkıyı gösterir",
  execute(client, message, args) {

    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Sesli kanalda olmalısın");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Şuan çalan şarkı yok");
    }

    message.channel.send(serverQueue.songs[0].title)




  }
}
