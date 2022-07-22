require("dotenv").config();

const Mongo = require("./dbServer");
const nodeFetch = require("node-fetch");
const date = new Date();

async function getPosts(client) {
  await Mongo.mongoClient.connect();
  //finding all the data to array in FetchedGames collection from database
  const findResult = await Mongo.dbo
    .collection("FetchedGames")
    .find({})
    .toArray();

  //deleting a document if document has been in db more than 29 days
  await findResult.forEach(async item => {
    var dt = new Date(item.dataDate)
    if (Math.floor(Math.abs(date - dt) / 1000 / 60 / 60 / 24) >= 30) {
      console.log(item.dataName)
      await Mongo.dbo.collection('FetchedGames').deleteOne({ dataId: item.dataId });
    }
  })

  const conditions = ["store.steampowered", "store.epicgames", "gog.com", "store.ubi", "origin.com", "ea.com", "xbox.com"]
  const dataFlair = ['My Game', 'Free to Play']
  //Getting posts from the freegames subreddit
  const targetURL = "https://reddit.com/r/freegames/new/.json?limit=10";
  const resp = await nodeFetch(targetURL, {
    Header: { "user-agent": process.env.USERAGENT },
  });
  const res = await resp.json();
  const posts = res.data.children;



  const guildsID = await client.guilds.fetch().then(guild => guild.map(x => x.id))
  // console.log(guildsID)
  guildsID.forEach(async (guildID) => {
    await Mongo.mongoClient.connect();
    const cGuild = client.guilds.cache.get(guildID)
    const freegamesChannel = await cGuild.channels.fetch().then(channel => channel.find(c => c.name === "freegames"))
    if (freegamesChannel === undefined) {
      cGuild.channels.create("freegames", {
        type: "GUILD_TEXT",
        permissionOverwrites: [{
          id: cGuild.id,
          allow: ["VIEW_CHANNEL"],
        }]
      });
    }
    else if (findResult.length === 0) {//Checking collection has data in it
      for (var i = 0; i < posts.length; i++) {
        if (!dataFlair.some(el => posts[i].data.link_flair_text?.includes(el) || false) && conditions.some(c => posts[i].data.url.includes(c))) {
          try {
            freegamesChannel
              .send(
                `${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url} `
              );
            await Mongo.dbo.collection("FetchedGames").insertMany([
              {
                dataId: posts[i].data.id,
                dataName: posts[i].data.title,
                dataDate: date.toLocaleDateString(),
                dataURL: posts[i].data.url,
              },
            ]);
          } catch (err) { }

        }
      }
    } else {

      for (var i = 0; i < posts.length; i++) {
        if (!dataFlair.some(el => posts[i].data.link_flair_text?.includes(el) || false) && conditions.some(c => posts[i].data.url.includes(c))) {
          //Checking if the data is already in the database
          if (findResult.some(item => item.dataURL == posts[i].data.url)) { }
          //If the data is not in the database, adding it
          else {
            await freegamesChannel
              .send(
                `${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url}`
              );
            try {
              await Mongo.dbo.collection("FetchedGames").insertMany([
                {
                  dataId: posts[i].data.id,
                  dataName: posts[i].data.title,
                  dataDate: date.toLocaleDateString(),
                  dataURL: posts[i].data.url,
                },
              ]);
              console.log(`Added: ${cGuild.name} - ${posts[i].data.title} (Free/100% Off)`);
            } catch (err) { }

          }
        }
      }
    }
    await Mongo.mongoClient.close();
  });

}
module.exports = { getPosts };
