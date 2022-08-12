const math = require("math-expression-evaluator");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "calculator",
  aliases: "calculator",
  description: "Calculator",
  async execute(client, message, args) {
    if (!args[0]) return message.channel.send("Enter a Value!");
    let resp;
    try {
      resp = math.eval(args.join(""));
    } catch (e) {
      return message.channel.send("Please Enter a valid Value!");
    }
    const embed = new EmbedBuilder()
      .setColor(0xffffff)
      .setTitle("Calculator")
      .addFields([
        { name: "Input", value: `\`\`\`js\n${args.join("")}\`\`\`` },
        { name: "Output", value: `\`\`\`js\n${resp}\`\`\`` },
      ]);
    message.channel.send({ embeds: [embed] });
  },
};
