const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Rock, Paper, Scissors'),
  category: 'games',
  async execute(interaction) {
    const reactions = ["rock", "paper", "scissors"];
    const botChoice = reactions[Math.floor(Math.random() * reactions.length)];
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Rock Paper Scissors")
      .setDescription("Play Rock, Paper, Scissors with me!");

    const rpsR = await interaction.reply({ embeds: [embed], fetchReply: true });

    await rpsR.react("🗻");
    await rpsR.react("📄");
    await rpsR.react("✂️");


    const filter = (reaction, user) =>
      ["🗻", "📄", "✂️"].includes(reaction.emoji.name) &&
      user.id === interaction.user.id &&
      !user.bot;

    await rpsR
      .awaitReactions({
        filter,
        max: 1,
        time: 10000,
      })
      .then((collected) => {
        const reaction = collected.first();
        const emoji = reaction.emoji.name;
        switch (emoji) {
          case "🗻":
            if (botChoice === "rock") {
              interaction.editReply({ embeds: [embed.setDescription("It's a tie!")] });
            } else if (botChoice === "paper") {
              interaction.editReply({ embeds: [embed.setDescription("I win!")] });
            } else {
              interaction.editReply({ embeds: [embed.setDescription("You win!")] });
            }
            break;
          case "📄":
            if (botChoice === "paper") {
              interaction.editReply({ embeds: [embed.setDescription("It's a tie!")] });
            } else if (botChoice === "scissors") {
              interaction.editReply({ embeds: [embed.setDescription("I win!")] });
            } else {
              interaction.editReply({ embeds: [embed.setDescription("You win!")] });
            }
            break;
          case "✂️":
            if (botChoice === "scissors") {
              interaction.editReply({ embeds: [embed.setDescription("**It's a tie!**")] });
            } else if (botChoice === "rock") {
              interaction.editReply({ embeds: [embed.setDescription("**I win!**")] });
            } else {
              interaction.editReply({ embeds: [embed.setDescription("**You win!**")] });
            }
            break;
          default:
            interaction.editReply({ embeds: [embed.setDescription("**Times Up, You didn't choose anything.**")] });
            break;
        }
      })
      .catch((err) => {
        interaction.editReply({ embeds: [embed.setDescription("**Times Up, You didn't choose anything.**")] });
      });
  },
};
