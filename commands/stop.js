module.exports = {
  name: "stop",
  aliases: "stop",
  description: "Stops the music entirely",
  voiceChannel: true,

  execute(client, message) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send({
        content: `${message.author}, There is no music currently playing!. ❌`,
      });

    queue.destroy();

    message.channel.send({
      content: `The music playing on this server has been turned off, see you next time ✅`,
    });
  },
};
