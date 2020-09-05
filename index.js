require("./server.js");
require('dotenv').config()
const discord = require("discord.js")
const { Client, MessageEmbed } = require('discord.js')
const client = new discord.Client({ disableEveryone: true, disabledEvents: ["TYPING_START"], partials: ['MESSAGE'] });
const { readdirSync } = require("fs");
const { join } = require("path");
const PREFIX = process.env.PREFIX;
const moment = require('moment');
const sql = require('sqlite')


sql.open('./Logs.sqlite');

//CLIENT EVENTS
client.on("ready", () => {
  console.log('Bot hazır')
  client.user.setActivity("n! - Gavat Sofu ile")
  const armutSporGuild = client.guilds.cache.get('249951409070407681')
  const memberCount = armutSporGuild.memberCount
  const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
  memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
  console.log('Üye Sayısı : ' + memberCount)
})

client.once('shardReconnecting', () => {
  console.log('Reconnecting!');
});
client.once('shardDisconnected', () => {
  console.log('Disconnect!');
});

client.on("warn", info => console.log(info));

client.on("error", console.error)

//DEFINIING
client.commands = new discord.Collection()
client.prefix = PREFIX
client.queue = new Map();


//LETS LOAD ALL FILES
const cmdFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"))
for (const file of cmdFiles) {
  const command = require(join(__dirname, "commands", file))
  client.commands.set(command.name, command)
} //LOADING DONE

client.on("guildMemberAdd", member => {
  var role = member.guild.roles.cache.find(role => role.name === "Yeni Üye");
  member.guild.channels.cache.get("617071160957337638").send("**" + member.user.username + "**, Hoşgeldin Toprağım");
  member.roles.add(role);
  const armutSporGuild = client.guilds.cache.get('249951409070407681')
  const memberCount = armutSporGuild.memberCount
  const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
  memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
});
client.on("guildMemberRemove", member => {
  member.guild.channels.cache.get("617071160957337638").send("**" + member.user.username + "**, Güle güle");
  const armutSporGuild = client.guilds.cache.get('249951409070407681')
  const memberCount = armutSporGuild.memberCount
  const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
  memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
});
client.on('messageDelete', async message => {
  try {
    if (message.channel.id === '526541910685384704' || message.author.bot || message.attachments.first() || message.guild.id !== '249951409070407681') return
  } catch (err) {
    console.log('Mesaj silme başarı ile gerçekleşti fakat Hata alındı')
  }

  if (!message.partials) {
    const channel = client.channels.cache.get('712110998286499930')

    if (channel) {
      try {
        const embed = new MessageEmbed()
          .setTitle('Silinen Mesaj')
          .addField('Mesajı yazan', `${message.author.tag}`)
          .addField('Silindiği Kanal', `${message.channel.name}`)
          .setDescription(message.content)
          .setTimestamp()

        channel.send(embed)
      } catch (err) {
        console.log('Eski bir mesaj silindi.')
      }
    }
  }
}
)

//WHEN SOMEONE MESSAGE
client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  let tStamp = moment().format('LLLL'); //creates time stamp
  if(message.attachments.first()) return;
  else{
  if (message.channel.type == 'dm') { //checks for DM - Creates a DM DB and records
    let dmName = `${message.author.username}DM`;
    sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(() => {
      sql.run(`CREATE TABLE IF NOT EXISTS ${dmName} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() => {
        sql.run(`INSERT INTO ${dmName} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
      })
    })
  } else { //otherwise it's a normal channel
    sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]).catch(() => {
      console.error;
      sql.run(`CREATE TABLE IF NOT EXISTS ${message.channel.name} (username TEXT, message TEXT, timestamp TEXT, userID TEXT);`).then(() => {
        sql.run(`INSERT INTO ${message.channel.name} (username, message, timestamp, userID) VALUES (?,?,?,?)`, [message.author.username, message.content, tStamp, message.author.id]);
      }) // KNOWN ISSUE: Does not like channels with "-" in them
    })
  }
}
  if (message.content.startsWith(PREFIX)) { //IF MESSSAGE STARTS WITH MINE BOT PREFIX

    const args = message.content.slice(PREFIX.length).trim().split(/ +/) //removing prefix from args
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) {
      return;
    }

    try { //TRY TO GET COMMAND AND EXECUTE
      client.commands.get(command).execute(client, message, args)
    } catch (err) { //IF IT CATCH ERROR
      console.log(err)
      message.reply("Böyle bir komut yok. Komutları öğrenmek için **n!help** yazın")
    }

  }
  let chatFilter = ['YASAK'];
  const wordPicker = message.content.toUpperCase().split(' ')
  for (var i = 0; i < chatFilter.length; i++) {
    if (wordPicker.includes(chatFilter[i])) {
      try {
        await message.delete();
        await message.reply('Yasaklı kelime kullandın');
      } catch (err) {
        console.log('Hata')
      }
    }
  }

});


client.login(process.env.TOKEN)