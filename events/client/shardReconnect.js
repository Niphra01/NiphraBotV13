const { Events, ActivityType } = require('discord.js');
const { GetGames } = require('../../src/freeGamesFetch');
module.exports = {
    name: Events.ShardReconnecting,
    async execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        console.log(`Reconnected! as ${client.user.tag}`);
        setInterval(async function () {
            await GetGames(client);
        }, 1000 * 60 * 60)
    }

}