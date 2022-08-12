require("dotenv").config();
const { getGames } = require("./src/Games");
//const { news } = require("./src/GetNews")
const { Player } = require("discord-player");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});
const fs = require("fs");
const path = require("path");
const Mongo = require("./src/configs/DbConfig");
const { Steam_Api } = require("./src/api/steam");
//DEFINING
client.config = require("./src/configs/MusicConfig");
client.player = new Player(client, client.config.opt.discordPlayer);
const player = client.player;
client.commands = new Collection();

// LOADING ALL FILES UNDER THE COMMANDS
const folders = fs.readdirSync("./commands/");
for (var i = 0; i < folders.length; i++) {
  const subFolders = folders[i].split(", ");
  for (var j = 0; j < subFolders.length; j++) {
    const commandFiles = fs
      .readdirSync(`./commands/${subFolders[j]}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(path.join(
        __dirname,
        `./commands/${subFolders[j]}`,
        file
      ));
      client.commands.set(command.name, command);
    }
  }
}

//CLIENT EVENTS
client.once("ready", async () => {
  console.log("Bot Ready");
  client.user.setActivity("Git Gud | -help", { type: "WATCHING" });
  setInterval(async function () {
    client.user.setActivity("Git Gud | -help", { type: "WATCHING" });
    //news(client);
    await getGames(client);
  }, 1000 * 60 * 60 * 2);
  setInterval(function () {
    Steam_Api();
  }, 1000 * 60 * 60 * 24 * 7);
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
  if (message) if (message.author.bot || !message.guild) return;

  const isCommand = message.content
    .slice(1)
    .trim()
    .split(/ +/)
    .shift()
    .toLowerCase(); //REMOVING PREFIX FROM ARGS
  let PREFIX;
  if (!client.commands.has(isCommand)) {
    //IF BOT DOESN'T HAVE THIS COMMAND
    return;
  } else if (message.content.includes(isCommand)) {
    //IF MESSAGE HAS COMMAND IN IT
    await Mongo.mongoClient.connect();
    const gPrefix = await Mongo.dbo
      .collection("BotEnv")
      .distinct("GuildPrefix", { GuildID: message.guild.id });
    await Mongo.mongoClient.close();
    if (gPrefix.length === 0) {
      PREFIX = process.env.PREFIX;
    } else {
      PREFIX = gPrefix;
    }
    if (message.content.startsWith(PREFIX)) {
      //IF MESSAGE STARTS WITH BOT PREFIX
      const args = message.content.slice(PREFIX.length).trim().split(/ +/); //REMOVING PREFIX FROM ARGS
      const command = args.shift().toLowerCase(); //REMOVING FIRST ELEMENT FROM ARGS AND ADDING TO COMMAND VARIABLE
      try {
        client.commands.get(command).execute(client, message, args);
      } catch (err) {
        console.log(err);
        message.reply({ content: "Can't find a command." });
      }
    } else if (message.content.includes(isCommand)) {
      if (gPrefix.length !== 0) {
        message.reply({ content: `Your guild Prefix is : **${PREFIX}**` });
      }
    }
  }
});

client.login(process.env.TOKEN);
