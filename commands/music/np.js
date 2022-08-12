const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "np",
  aliases: "np",
  description: "Shows the current playing Song",
  voiceChannel: true,

  execute(client, message) {
    const queue = client.player.getQueue(message.guild.id);

    if (!queue || !queue.playing)
      return message.channel.send({
        content: `${message.author}, There is no music currently playing!. ❌`,
      });

    const track = queue.current;

    const embed = new EmbedBuilder();

    embed.setColor("BLUE");
    embed.setThumbnail(track.thumbnail);
    embed.setTitle(track.title);

    const methods = ["disabled", "track", "queue"];

    const timestamp = queue.getPlayerTimestamp();
    const trackDuration =
      timestamp.progress == "Forever" ? "Endless (Live)" : track.duration;

    embed.setDescription(
      `Duration **${trackDuration}**\nURL: ${track.url}\n${track.requestedBy}`
    );
    embed.setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
};
