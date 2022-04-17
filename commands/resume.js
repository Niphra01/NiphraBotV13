module.exports = {
  name: "resume",
  aliases: "resume",
  description: "Resumes the stopped Song",
  voiceChannel: true,

  execute(client, message) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue)
      return message.channel.send({
        content: `${message.author}, There is no music currently playing!. ❌`,
      });

    const success = queue.setPaused(false);

    return message.channel.send({
      content: success
        ? `**${queue.current.title}**, The song continues to play. ✅`
        : `${message.author}, Something went wrong. ❌`,
    });
  },
};
