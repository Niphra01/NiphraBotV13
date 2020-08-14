module.exports = {
  name: "skip",
  aliases: ':fast_forward:  skip',
  description: "Çalan şarkıyı atlar",
  execute(client, message, args) {
    const { channel } = message.member.voice;

    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Sesli kanalda olmalısın");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Geçilebilecek şarkı yok");
    }
    try{
    serverQueue.connection.dispatcher.end();
	}catch(err)
	{
		console.log('Şarkı geçilirken hata meydana geldi ',err);
	}
    message.channel.send(":white_check_mark: | Şarkı geçildi");
  }
};
