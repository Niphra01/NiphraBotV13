module.exports = {
    name: 'disconnect',
    isPlayerEvent: true,
    async execute(queue, track) {
        queue.metadata.send('Looks like my job here is done, leaving now!');
    },
};