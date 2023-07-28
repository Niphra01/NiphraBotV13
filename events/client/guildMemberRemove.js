const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
    async execute(member) {
        try {
            const guild = await client.guilds.cache.get(member.guild.id);
            const cName = await guild.channels.fetch().then((channel) => channel.find((c) => c.name === "alımodası"));
            if (cName === undefined) {
                guild.channels.create("alımodası", {
                    type: "GUILD_TEXT",
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            allow: ["VIEW_CHANNEL"],
                        },
                    ],
                });
                cName.send("**" + member.user.username + "** , left");
            } else {
                cName.send("**" + member.user.username + "** , left");
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};