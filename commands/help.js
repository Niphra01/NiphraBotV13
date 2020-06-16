const discord = require('discord.js');

module.exports = {
  name: "help",
  aliases: ":page_facing_up: help",
  description: "Komutların ne işe yaradıklarını gösterir",
  async execute(client, message, args) {
    const commands = message.client.commands.array();
    const helpEmbed = new discord.MessageEmbed()
      .setTitle('Komutlar')
      .setDescription('PREFIX: n!')
      .setFooter('Örnek n!userinfo <@user>')
    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`, true
      );
    });
    helpEmbed.setTimestamp();
    message.channel.send(helpEmbed);
  }

}