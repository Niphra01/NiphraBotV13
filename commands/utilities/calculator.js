const math = require("math-expression-evaluator");
const { MessageEmbed } = require("discord.js");

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
    const embed = new MessageEmbed()
      .setColor(0xffffff)
      .setTitle("Calculator")
      .addField("Input", `\`\`\`js\n${args.join("")}\`\`\``)
      .addField("Output", `\`\`\`js\n${resp}\`\`\``);

    message.channel.send({ embeds: [embed] });
  },
};
