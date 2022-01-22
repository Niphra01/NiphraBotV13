const math = require("math-expression-evaluator");
const discord = require("discord.js");

module.exports = {
    name: "hesap",
    aliases: 'hesap',
    description: "Hesap makinesi",
    async execute(client, message, args) {

        if (!args[0]) return message.channel.send("Bir değer giriniz!");
        let resp;
        try {
            resp = math.eval(args.join(''));
        } catch (e) {
            return message.channel.send("Geçerli bir değer giriniz!");
        }
        const embed = new discord.MessageEmbed()
            .setColor(0xffffff)
            .setTitle("Matematik hesaplaması")
            .addField("Girdi", `\`\`\`js\n${args.join('')}\`\`\``)
            .addField("Çıktı", `\`\`\`js\n${resp}\`\`\``)

        message.channel.send({embeds: [embed]});
    }
}