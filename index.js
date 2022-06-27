require("dotenv").config();
const { getPosts } = require("./src/fetchGames");
const { Player } = require("discord-player");
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
}); //
const fs = require("fs");
const path = require("path");
const Mongo = require('./src/dbServer')

//DEFINING


client.config = require("./src/MusicConfig");
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player;
client.commands = new Collection();

// LOADING ALL FILES UNDER THE COMMANDS
const folders = fs.readdirSync("./commands/");
for (var i = 0; i < folders.length; i++) {
  const altFolders = folders[i].split(", ");
  for (var j = 0; j < altFolders.length; j++) {
    const commandFiles = fs
      .readdirSync(`./commands/${altFolders[j]}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(path.join(__dirname, `./commands/${altFolders[j]}`, file));
      client.commands.set(command.name, command);
    }
  }
}

//CLIENT EVENTS
client.once("ready", () => {
  console.log("Bot Ready");
  client.user.setActivity("Git Gud");
  getPosts(client)
  setInterval(getPosts, 1000 * 60 * 20, client);
});

client.once("shardReconnecting", () => {
  console.log("Reconnected!");
});
client.once("shardDisconnected", () => {
  console.log("Disconnected!");
});

client.on("warn", (info) => console.log(info));

client.on("error", console.error);

client.on("guildMemberAdd", (member) => {
  try {
    let role = member.guild.roles.cache.find(
      (role) => role.name === "Yeni Üye"
    );
    member.guild.channels.cache
      .get("617071160957337638")
      .send("**" + member.user.username + "** , joined");
    member.roles.add(role);
  } catch (err) { }
});
client.on("guildMemberRemove", (member) => {
  try {
    member.guild.channels.cache
      .get("617071160957337638")
      .send("**" + member.user.username + "**, left");
  } catch (err) { }
});

//MUSIC PLAYER EVENTS
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

  await Mongo.mongoClient.connect()
  const gPrefix = await Mongo.dbo
    .collection("BotEnv").distinct("GuildPrefix", { GuildID: message.guild.id });
  await Mongo.mongoClient.close()
  let PREFIX;
  if (gPrefix.length === 0) {
    PREFIX = process.env.PREFIX
  }
  else {
    PREFIX = gPrefix;
  }


  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(PREFIX)) {
    //IF MESSAGE STARTS WITH BOT PREFIX

    const args = message.content.slice(PREFIX.length).trim().split(/ +/); //removing prefix from args
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
      return;
    }

    //IF COMMAND EXISTS
    try {
      client.commands.get(command).execute(client, message, args);
    } catch (err) {
      console.log(err);
      message.reply({ content: "Can't find a command." });
    }
  } else if (message.content.toLowerCase().startsWith('prefix')) {
    message.reply({ content: `Your guild Prefix is : **${PREFIX}**` })
  }
});

client.login(process.env.TOKEN);
