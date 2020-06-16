const discord = require("discord.js");

module.exports = {
  name: "stop",
  aliases: ':no_entry: stop',
  description: "Şarkıları durdurur.",
  execute(client, message, args) {
    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Sesli kanalda olmalısın");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Durdurulacak şarkı yok");
    }

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();

    serverQueue.textChannel.send(":octagonal_sign: | **Şarkı durduruldu**");
  }
};
