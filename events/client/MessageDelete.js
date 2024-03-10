const { Events, Message} = require('discord.js');
const { logger } = require('../../src/logger');

module.exports = {
    /**
     * @param {Message} message
     */
    name: Events.MessageDelete,
    once: true,
    execute(message) {
        if(message.author.bot) return;
        logger.warn(`${message.content?message.content:"None"} ------ ${message.author.tag}`);
    },
};