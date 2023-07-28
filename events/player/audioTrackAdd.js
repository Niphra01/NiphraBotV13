module.exports = {
    name: 'audioTrackkAdd',
    isPlayerEvent: true,
    async execute(queue, track) {
        queue.metadata.send(`Track **${track.title}** queued`);
    },
};