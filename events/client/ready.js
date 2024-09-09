const { Events, ActivityType } = require('discord.js');
const { GetGames } = require('../../src/freeGamesFetch');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Ready! Logged in as ${client.user.tag}`)
	GetGames(client);
        setInterval(async function () {
            await GetGames(client);
        }, 1000 * 60 * 60)
    },
};