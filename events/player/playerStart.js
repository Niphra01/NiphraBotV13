module.exports = {
    name: 'playerStart',
    isPlayerEvent: true,
    async execute(queue, track) {
        queue.metadata.send(`Started playing: **${track.title}**`);
    },
};