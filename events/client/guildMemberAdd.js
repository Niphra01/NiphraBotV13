const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    async execute(client, member) {
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
                let role = member.guild.roles.cache.find((role) => role.name === "Yeni Üye")
                cName.send("**" + member.user.username + "** , joined");
                member.roles.add(role);
            } else {
                let role = member.guild.roles.cache.find((role) => role.name === "Yeni Üye")
                cName.send("**" + member.user.username + "** , joined");
                member.roles.add(role);
            }

        } catch (err) {
            console.log(err);
        }
    },
};