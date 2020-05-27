const ytdlDiscord = require("ytdl-core-discord");

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);

    
    if(!song) {
		      message.guild.me.voice.channel.leave();
		      message.client.queue.delete(message.guild.id);
          return queue.textChannel.send("Şarkı sırası sona erdi! - Kanaldan ayrılınıyor").catch(console.error);
      
    }
    
    try {
      var stream = await ytdlDiscord(song.url, {
        highWaterMark: 1 << 25,
      });
      
    } catch (error) {
      if(queue) {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
      
      if(error.message.includes === "copyright") {
        return message.channel.send("Bu şarkı copyright unsuru içeriyor")
      } else {
        console.error(error)
      }
    }
    
    const dispatcher = queue.connection
    .play(stream, {type: "opus"}).on("finish", () => {
      if(queue.loop) {
        let lastsong = queue.songs.shift()
        queue.songs.push(lastsong)
        module.exports.play(queue.songs[0], message)
      } else {
        queue.songs.shift()
        module.exports.play(queue.songs[0], message)
      }
    }).on("error", console.error)
    dispatcher.setVolumeLogarithmic(queue.volume / 100); //VOLUME
    
    
    
      queue.textChannel.send(`**Şarkı çalınıyor** - [${song.title}](${song.url})`)
    
    
  }
}