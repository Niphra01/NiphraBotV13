module.exports = {
  name: "loop",
  aliases: ':arrows_counterclockwise:  loop',
  description: "Şarkıyı döngüye sokar",
  execute(client, message, args) {

    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Sesli kanalda olmalısın");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Döngüye girecek herhangi bir şarkı çalmıyor");
    }

    //OOOOF
    serverQueue.loop = !serverQueue.loop



    message.channel.send(`Şuan ki döngü **${serverQueue.loop ? "Aktif" : "Devre dışı"}**`)




  }
}
