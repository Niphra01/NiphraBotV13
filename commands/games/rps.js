const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "rps",
    aliases: 'rps',
    description: "Rock Paper Scissors",
    async execute(client, message, args) {
        const reactions = ["rock", "paper", "scissors"];
        const botChoice = reactions[Math.floor(Math.random() * reactions.length)];
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Rock Paper Scissors")
            .setDescription("Play Rock Paper Scissors with me!")



        const rpsR = await message.reply({ embeds: [embed] })

        await rpsR.react('🗻');
        await rpsR.react('📄');
        await rpsR.react('✂️');


        const filter = (reaction, user) => ["🗻", "📄", "✂️"].includes(reaction.emoji.name) && (user.id === message.author.id && !user.bot);

        await rpsR.awaitReactions({
            filter,
            max: 1,
            time: 10000,
        }).then(collected => {
            const reaction = collected.first();
            const emoji = reaction.emoji.name;
            switch (emoji) {
                case '🗻':
                    if (botChoice === "rock") {
                        message.reply("It's a tie!");
                    } else if (botChoice === "paper") {
                        message.reply("I win!");
                    } else {
                        message.reply("You win!");
                    }
                    break;
                case '📄':
                    if (botChoice === "paper") {
                        message.reply("It's a tie!");
                    } else if (botChoice === "scissors") {
                        message.reply("I win!");
                    } else {
                        message.reply("You win!");
                    }
                    break;
                case '✂️':
                    if (botChoice === "scissors") {
                        message.reply("It's a tie!");
                    } else if (botChoice === "rock") {
                        message.reply("I win!");
                    } else {
                        message.reply("You win!");
                    }
                    break;
                default:
                    message.reply("You didn't choose anything!");
                    break;


            }

        }).catch(err => {
            message.reply("You didn't choose anything!");
        }
        );

    }
}