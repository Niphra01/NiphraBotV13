require("dotenv").config();

const { channel } = require("diagnostics_channel");
const { Player } = require("discord-player");
const {
  Client,
  MessageEmbed,
  Intents,
  discord,
  Collection,
  Guild,
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

//CLIENT EVENTS
client.on("ready", () => {
  console.log("Bot Ready");
  client.user.setActivity("Git Gud");
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

client.config = require("./config");
client.player = new Player(client, client.config.opt.discordPlayer);
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
  } catch (err) { }
});
client.on("guildMemberRemove", (member) => {
  try {
    member.guild.channels.cache
      .get("617071160957337638")
      .send("**" + member.user.username + "**, left");
  } catch (err) { }
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
      message.reply("Can't find a command.");
    }
  }
});

client.login(process.env.TOKEN);
