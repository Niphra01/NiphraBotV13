module.exports = {
  name: "skip",
  aliases: "skip",
  description: "Skips current song",
  voiceChannel: true,

  execute(client, message) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send({
        content: `${message.author}, There is no music currently playing!. ❌`,
      });

    const success = queue.skip();

    return message.channel.send({
      content: success
        ? `**${queue.current.title}**, Skipped song ✅`
        : `${message.author}, Something went wrong ❌`,
    });
  },
};
