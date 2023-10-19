const { Events, ActivityType } = require('discord.js');
const { GetGames } = require('../../src/freeGamesFetch');
const { logger } = require('../../src/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity('Git - Gud', { type: ActivityType.Competing })
        logger.info(`Ready! Logged in as ${client.user.tag}`);
        setInterval(async function () {
            await GetGames(client);
        }, 1000 * 60 * 60)
    },
};