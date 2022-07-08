const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "wordle",
    description: "Wordle Game - Try to find words with 5 syllable",
    async execute(client, message, args) {
        const SECONDARY = "SECONDARY"
        const PRIMARY = "PRIMARY"
        const SUCCESS = "SUCCESS"
        const everySyllables = args[0].split("")
        console.log(everySyllables)
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('first')
                    .setLabel('Primary')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('second')
                    .setLabel('Primary')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('third')
                    .setLabel('Primary')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('fourth')
                    .setLabel('Primary')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('fifth')
                    .setLabel('Primary')
                    .setStyle('SECONDARY')
                    .setDisabled(true),
            )
        await message.reply({ components: [row] });
    }
}