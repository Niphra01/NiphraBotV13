module.exports = {
    name: 'emptyQueue',
    isPlayerEvent: true,
    async execute(queue, track) {
        queue.metadata.send('Queue finished!');
    },
};