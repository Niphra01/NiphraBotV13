module.exports = {
    name: 'playerSkip',
    isPlayerEvent: true,
    async execute(queue, track) {
        queue.metadata.send(`Skipping **${track.title}** due to an issue!`);
    },
};