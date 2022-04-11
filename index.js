require('dotenv').config()
const { Client, MessageEmbed, Intents, discord, Collection } = require('discord.js')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] }) // 
const fs = require('fs');
const path = require("path");
const PREFIX = process.env.PREFIX;
const moment = require('moment');



//CLIENT EVENTS
client.on("ready", () => {
  console.log('Bot hazır')
  client.user.setActivity("Working on Spotify and Youtube music implement")
  try {
    const armutSporGuild = client.guilds.cache.get('249951409070407681')
    const memberCount = armutSporGuild.memberCount
    const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
    memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
    console.log('Üye Sayısı : ' + memberCount)
  } catch (err) {
  }
})

client.once('shardReconnecting', () => {
  console.log('Reconnected!');
});
client.once('shardDisconnected', () => {
  console.log('Disconnected!');
});

client.on("warn", info => console.log(info));

client.on("error", console.error)

//DEFINIING
client.commands = new Collection()
client.prefix = PREFIX


// LETS LOAD ALL FILES
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.name, command);
} //LOADING DONE

client.on("guildMemberAdd", member => {
  try {
    var role = member.guild.roles.cache.find(role => role.name === "Yeni Üye");
    member.guild.channels.cache.get("617071160957337638").send("**" + member.user.username + "**, Hoşgeldin Toprağım");
    member.roles.add(role);
    const armutSporGuild = client.guilds.cache.get('249951409070407681')
    const memberCount = armutSporGuild.memberCount
    const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
    memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
  } catch (err) {
  }
});
client.on("guildMemberRemove", member => {
  try {
    member.guild.channels.cache.get("617071160957337638").send("**" + member.user.username + "**, Güle güle");
    const armutSporGuild = client.guilds.cache.get('249951409070407681')
    const memberCount = armutSporGuild.memberCount
    const memberCountChannel = armutSporGuild.channels.cache.get('714001061681168384')
    memberCountChannel.setName(`Üye Sayısı :  ` + memberCount)
  } catch (err) {
  }
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
          .addField('Mesajı yazan', `${message.author.tag}`.toString())
          .addField('Silindiği Kanal', `${message.channel.name}`.toString())
          .setDescription(message.content)
          .setTimestamp()

        channel.send({ embeds: [embed] })
      } catch (err) {
        console.log('Eski bir mesaj silindi.')
      }
    }
  }
}
)

//WHEN SOMEONE MESSAGE
client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
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
        await message.reply('Yasaklı kelime kullandın');
        await message.delete();
      } catch (err) {
        console.log('Hata')
      }
    }
  }

});


client.login(process.env.TOKEN)