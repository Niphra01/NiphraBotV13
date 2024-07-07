const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer ,QueryType } = require('discord-player')
const { playerOptions } = require('../../src/configs/playerConfigs');
const { logger } = require('../../src/logger');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('plays music')
        .addStringOption(option =>
            option.setName('query')
                .setDescription("Type a query/url")
                .setRequired(true)),
                
    category: 'music',
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) return interaction.reply({ content: 'You are not connected to a voice channel!', ephemeral: true })
        const query = interaction.options.getString("query", true)

        await interaction.deferReply();

        const searchResult = await player.search(query, { requestedBy: interaction.user,searchEngine:QueryType.AUTO});
        if (!searchResult.hasTracks()) {
            await interaction.editReply({ content: `We found no tracks for ${query}`, ephemeral: true });
            return;
        }

        const queue = await player.nodes.create(interaction.guild, {
            selfDeaf: playerOptions.selfDeaf ?? true,
            volume: playerOptions.volume ?? 65,
            leaveOnEmpty: playerOptions.leaveOnEmpty ?? true,
            leaveOnEmptyCooldown: playerOptions.leaveOnEmptyCooldown ?? 60000,
            leaveOnEnd: playerOptions.leaveOnEnd ?? true,
            leaveOnEndCooldown: playerOptions.leaveOnEmptyCooldown ?? 60000,
            maxHistorySize: playerOptions.maxHistorySize ?? 100,
            maxSize: playerOptions.maxQueueSize ?? 1000

        })
        
        try {
            if (!queue.connection) await queue.connect(channel);
        } catch (error) {
            await player.destroy(interaction.guild.id)
            logger.error(error);
            return interaction.followUp({ content: `Something went wrong: ${error}`, ephemeral: true })
        }
        await queue.addTrack(searchResult.tracks);

        await interaction.followUp({ content: `**${searchResult.tracks[0].title}** has enqueued`, ephemeral: true })

        if (!queue.isPlaying()) await queue.node.play();

    }
}