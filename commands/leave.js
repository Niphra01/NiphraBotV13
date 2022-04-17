module.exports = {
  name: "leave",
  aliases: "leave",
  description: "Bot leaves the Voice Channel",
  async execute(client, message) {
    if (!message.member.voice.channel) return;
    message.guild.me.voice.channel.leave();
    message.channel.send("Left the voicechannel");
  },
};
