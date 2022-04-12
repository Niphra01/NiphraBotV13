require("dotenv").config();
const { Player } = require("discord-player");
const {
  Client,
  MessageEmbed,
  Intents,
  discord,
  Collection,
} = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
}); //
const fs = require("fs");
const path = require("path");
const PREFIX = process.env.PREFIX;
const moment = require("moment");

//CLIENT EVENTS
client.on("ready", () => {
  console.log("Bot Ready");
  client.user.setActivity("Git Gud");
  try {
    const armutSporGuild = client.guilds.cache.get("249951409070407681");
    const memberCount = armutSporGuild.memberCount;
    const memberCountChannel =
      armutSporGuild.channels.cache.get("714001061681168384");
    memberCountChannel.setName(`Members :  ` + memberCount);
    console.log("Members : " + memberCount);
  } catch (err) {}
});

client.once("shardReconnecting", () => {
  console.log("Reconnected!");
});
client.once("shardDisconnected", () => {
  console.log("Disconnected!");
});

client.on("warn", (info) => console.log(info));

client.on("error", console.error);

//DEFINIING
client.commands = new Collection();
client.prefix = PREFIX;

// LETS LOAD ALL FILES
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, "commands", file));
  client.commands.set(command.name, command);
} //LOADING DONE

//client.config = require("./config.js");
client.player = new Player(client);
const player = client.player;

client.on("guildMemberAdd", (member) => {
  try {
    var role = member.guild.roles.cache.find(
      (role) => role.name === "Yeni Üye"
    );
    member.guild.channels.cache
      .get("617071160957337638")
      .send("**" + member.user.username + "** , joined");
    member.roles.add(role);
    const armutSporGuild = client.guilds.cache.get("249951409070407681");
    const memberCount = armutSporGuild.memberCount;
    const memberCountChannel =
      armutSporGuild.channels.cache.get("714001061681168384");
    memberCountChannel.setName(`Members :  ` + memberCount);
  } catch (err) {}
});
client.on("guildMemberRemove", (member) => {
  try {
    member.guild.channels.cache
      .get("617071160957337638")
      .send("**" + member.user.username + "**, left");
    const armutSporGuild = client.guilds.cache.get("249951409070407681");
    const memberCount = armutSporGuild.memberCount;
    const memberCountChannel =
      armutSporGuild.channels.cache.get("714001061681168384");
    memberCountChannel.setName(`Members :  ` + memberCount);
  } catch (err) {}
});
client.on("messageDelete", async (message) => {
  try {
    if (
      message.channel.id === "526541910685384704" ||
      message.author.bot ||
      message.attachments.first() ||
      message.guild.id !== "249951409070407681"
    )
      return;
  } catch (err) {
    console.log("Discord 14 days thingy");
  }

  if (!message.partials) {
    const channel = client.channels.cache.get("712110998286499930");

    if (channel) {
      try {
        const embed = new MessageEmbed()
          .setTitle("Deleted Message")
          .addField("Message Author", `${message.author.tag}`.toString())
          .addField("Deleted Channel", `${message.channel.name}`.toString())
          .setDescription(message.content)
          .setTimestamp();

        channel.send({ embeds: [embed] });
      } catch (err) {
        console.log("Deleted an old message");
      }
    }
  }
});

player.on("trackStart", (queue, track) => {
  if (queue.repeatMode !== 0) return;
  queue.metadata.send({
    content: `🎵 Music started playing: **${track.title}** -> Channel: **${queue.connection.channel.name}** 🎧`,
  });
});

player.on("trackAdd", (queue, track) => {
  queue.metadata.send({ content: `**${track.title}** added to playlist. ✅` });
});

player.on("botDisconnect", (queue) => {
  queue.metadata.send({
    content:
      "Someone from the audio channel Im connected to kicked me out, the whole playlist has been cleared! ❌",
  });
});

player.on("channelEmpty", (queue) => {
  queue.metadata.send({
    content:
      "I left the audio channel because there is no one on my audio channel. ❌",
  });
});

player.on("queueEnd", (queue) => {
  queue.metadata.send({
    content:
      "All play queue finished, I think you can listen to some more music. ✅",
  });
});

//WHEN SOMEONE MESSAGE
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.content.startsWith(PREFIX)) {
    //IF MESSSAGE STARTS WITH MINE BOT PREFIX

    const args = message.content.slice(PREFIX.length).trim().split(/ +/); //removing prefix from args
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
      return;
    }

    try {
      //TRY TO GET COMMAND AND EXECUTE
      client.commands.get(command).execute(client, message, args);
    } catch (err) {
      //IF IT CATCH ERROR
      console.log(err);
      message.reply(
        "Can't find a command."
      );
    }
  }
  // let chatFilter = [""];
  // const wordPicker = message.content.toUpperCase().split(" ");
  // for (var i = 0; i < chatFilter.length; i++) {
  //   if (wordPicker.includes(chatFilter[i])) {
  //     try {
  //       await message.reply("Please be respectful to each other");
  //       await message.delete();
  //     } catch (err) {
  //       console.log("------------ Error");
  //     }
  //   }
  // }
});

client.login(process.env.TOKEN);
