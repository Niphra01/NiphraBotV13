const { Events, ActivityType } = require('discord.js');
const { getGames } = require('../../src/games');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Ready! Logged in as ${client.user.tag}`);
        getGames(client);
        setInterval(async function () {
            await getGames(client);
        }, 1000 * 60 * 60)
    },
};