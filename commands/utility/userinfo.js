const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Shows the users info')
    .addUserOption(option =>
      option.setName('user')
        .setDescription("Mention the user.")
        .setRequired(true)),
  category: 'utility',
  async execute(interaction) {
    let user = interaction.options.getUser('user')

    member = interaction.guild.members.cache.get(user.id);
    if (!user.bot) {
      const embed = new EmbedBuilder()
        .setColor('Green')
        .setThumbnail(user.displayAvatarURL())
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .addFields([
          {
            name: "Nickname",
            value: `${member.nickname !== null ? `${member.nickname}` : "-"
              }`,
          },
          { name: "Created at", value: `${user.createdAt.toLocaleString()}` },
          { name: "Joined at", value: `${member.joinedAt.toLocaleString()}` },
          {
            name: "Roles",
            value: `${member.roles.cache
              .map((role) => role.toString())
              .join(", ")}`,
          },
        ]);
      return interaction.reply({ embeds: [embed] });
    } else {
      return interaction.reply({ content: "User is bot", ephemeral: true });
    }
  },
};
