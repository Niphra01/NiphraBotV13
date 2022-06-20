const { MessageEmbed } = require("discord.js");
module.exports = {
    name: "rps",
    description: "Rock Paper Scissors",
    async execute(client, message, args) {
        const reactions = ["rock", "paper", "scissors"];
        const botChoice = reactions[Math.floor(Math.random() * reactions.length)];
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Rock Paper Scissors")
            .setDescription("Play Rock Paper Scissors with me!")



        const rpsR = await message.channel.send({ embeds: [embed] })

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
                        message.channel.send("It's a tie!");
                    } else if (botChoice === "paper") {
                        message.channel.send("I win!");
                    } else {
                        message.channel.send("You win!");
                    }
                    break;
                case '📄':
                    if (botChoice === "paper") {
                        message.channel.send("It's a tie!");
                    } else if (botChoice === "scissors") {
                        message.channel.send("I win!");
                    } else {
                        message.channel.send("You win!");
                    }
                    break;
                case '✂️':
                    if (botChoice === "scissors") {
                        message.channel.send("It's a tie!");
                    } else if (botChoice === "rock") {
                        message.channel.send("I win!");
                    } else {
                        message.channel.send("You win!");
                    }
                    break;
                default:
                    message.channel.send("You didn't choose anything!");
                    break;


            }

        }).catch(err => {
            message.channel.send("You didn't choose anything!");
        }
        );

    }
}