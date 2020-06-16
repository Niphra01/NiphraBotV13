const Genius = new (require("genius-lyrics"))("ApavK7sxIw4WfaTNVe1g9Hc8civ8WqGW0NWx_akrti6Bcg3Nc7ILibv9LoVDoT0-");
const { MessageEmbed } = require("discord.js")
module.exports = {
  name: "lyrics",
  aliases: 'lyrics',
  description: "Şarkı sözlerini yazdırır",
  async execute(client, message, args) {

    const { channel } = message.member.voice;
    if (!channel) {
      //IF AUTHOR IS NOT IN VOICE CHANNEL
      return message.channel.send("Sesli kanalda olmalısın");
    }

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("Şuan çalan şarkı yok");
    }

    let m = await message.channel.send("Sözler bulunuyor...")


    //NOw we gonna see on playing song
    Genius.tracks.search(serverQueue.songs[0].title)
      .then(results => {
        const song = results[0];
        song.lyrics()
          .then(lyrics => {
            if (lyrics.length > 4095) {
              return message.channel.send("Sözler çok uzun")
            }

            if (lyrics.length < 2048) {
              const lyricsEmbed = new MessageEmbed()
                .setColor("#ff2050")
                .setDescription(lyrics.trim());
              return m.edit('', lyricsEmbed);
            }
            m.delete()

          })
      }).catch(err => message.channel.send("Sözler bulunamadı"));


  }
}
