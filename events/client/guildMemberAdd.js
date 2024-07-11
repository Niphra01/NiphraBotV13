const { Events, EmbedBuilder } = require('discord.js');
const { logger } = require('../../src/logger');
const embed = new EmbedBuilder()

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            let role = member.guild.roles.cache.find(
                (role) => role.name === "Yeni Üye");
            member.guild.channels.cache
                .get("617071160957337638")
                .send("**" + member.user + "\n" +
                    embed.setColor('Purple'),
                    embed.setThumbnail(member.user.displayAvatarURL()),
                    embed.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
                    + "** , joined");
            member.roles.add(role);

        } catch (err) {
            logger.error(err);
        }
    },
};


