require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const appInfo = require("./configs/steamAppsInfo.json");
const Mongo = require("./configs/DbConfig");
const fetch = require("node-fetch");
const date = new Date();
const coll = Mongo.dbo.collection("FetchedGames");
async function getGames(client) {
  await Mongo.mongoClient.connect();

  //finding all the data to array in FetchedGames collection from database
  const findResult = await coll.find({}).toArray();

  //deleting a document if document has been in db more than 29 days
  await findResult.forEach(async (item) => {
    var dt = new Date(item.dataDate);
    if (Math.floor(Math.abs(date - dt) / 1000 / 60 / 60 / 24) >= 30) {
      console.log(item.dataName);
      await coll.deleteOne({ dataId: item.dataId });
    }
  });

  const conditions = [
    "gog.com",
    "store.ubi",
    "origin.com",
    "ea.com",
    "xbox.com",
  ];
  const dataFlair = ["My Game", "Free to Play"];
  //Getting posts from the freegames subreddits
  const targetURL = "https://reddit.com/r/freegames/new/.json?limit=10";
  const resp = await fetch(targetURL, {
    Header: { "user-agent": process.env.USERAGENT },
  });
  const res = await resp.json();
  const posts = res.data.children;
  const guildsID = await client.guilds.fetch().then((guild) => guild.map((x) => x.id));
  // console.log(guildsID)
  guildsID.forEach(async (guildID) => {
    await Mongo.mongoClient.connect();
    const cGuild = client.guilds.cache.get(guildID);
    const freegamesChannel = await cGuild.channels
      .fetch()
      .then((channel) => channel.find((c) => c.name === "freegames"));

    if (freegamesChannel === undefined) {
      cGuild.channels.create("freegames", {
        type: "GUILD_TEXT",
        permissionOverwrites: [
          {
            id: cGuild.id,
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });
    } else {
      for (var i = 0; i < posts.length; i++) {
        if (
          !dataFlair.some(
            (el) => posts[i].data.link_flair_text?.includes(el) || false
          ) &&
          conditions.some((c) => posts[i].data.url.includes(c))
        ) {
          //Checking if the data is already in the database
          if (findResult.some((item) => item.dataURL == posts[i].data.url)) {
          }
          //If the data is not in the database, adding it
          else {
            await freegamesChannel.send(
              `${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url}`
            );
            try {
              await coll.insertMany([
                {
                  dataId: posts[i].data.id,
                  dataName: posts[i].data.title,
                  dataDate: date.toLocaleDateString(),
                  dataURL: posts[i].data.url,
                },
              ]);
              console.log(
                `Added: ${cGuild.name} - ${posts[i].data.title} (Free/100% Off)`
              );
            } catch (err) { }
          }
        }
      }
    }

    await Mongo.mongoClient.close();
  });
  await epicGames(client, guildsID, findResult)
  //await steamGames(client, guildsID, findResult);

}
module.exports = { getGames };

const steamGames = async (client, guildsID, findResult) => {
  for (var i = 0; i < appInfo.applist.apps.length; i++) {
    const uri = `http://store.steampowered.com/api/appdetails?appids=${appInfo.applist.apps[i].appid}`;
    const resp = await fetch(uri, {
      Header: { "user-agent": process.env.USERAGENT },
    });
    const result = await resp.json();
    try {
      const gameData = result[appInfo.applist.apps[i].appid].data;
      if (result[appInfo.applist.apps[i].appid].success == false) {
      } else {
        if (
          findResult.some((item) => item.dataId == gameData.steam_appid)
        ) {
          console.log(`Game already added to DB - ${gameData.name}`);
        }
        else {
          if (gameData.is_free == true) {
            if (
              gameData.price_overview.discount_percent === 100 &&
              gameData.price_overview.final_formatted == "Free"
            ) {
              guildsID.forEach(async (guildID) => {
                const cGuild = client.guilds.cache.get(guildID);
                const freegamesChannel = await cGuild.channels
                  .fetch()
                  .then((channel) =>
                    channel.find((c) => c.name === "freegames")
                  );

                const Embed = new EmbedBuilder()
                  .setTitle(gameData.name)
                  .setDescription(`${gameData.short_description}`)
                  .addFields([
                    {
                      name: "Type",
                      value: `${gameData.type.toUpperCase()}`,
                    },
                    {
                      name: "Price",
                      value: `~~${gameData.price_overview.initial_formatted}~~ | ${gameData.price_overview.final_formatted}`,
                    },
                  ])
                  .setImage(gameData.header_image)
                  .setURL(
                    `http://store.steampowered.com/app/${gameData.steam_appid}`
                  );

                freegamesChannel.send({ embeds: [Embed] });
                console.log(`Added: ${cGuild.name} - ${gameData.name} `);
                try {
                  await Mongo.mongoClient.connect();
                  await coll.insertMany([
                    {
                      dataId: gameData.steam_appid,
                      dataName: gameData.name,
                      dataDate: date.toLocaleDateString(),
                      dataURL: `http://store.steampowered.com/app/${gameData.steam_appid}`,
                    },
                  ]);
                  await Mongo.mongoClient.close();
                } catch (err) { }
              });
            }
          }
          else if (gameData.price_overview == undefined) {
            // 'Game is not released yet'
          }
        }
      }
    } catch (err) { }
  }
};


const epicGames = async (client, guildsID, findResult) => {
  const url = "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US,CN";
  const options = {
    method: "GET",
    headers: {
      "user-agent": process.env.USERAGENT,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((data) =>
      data.data.Catalog.searchStore.elements.forEach((el) => {
        if (
          findResult.some((item) => item.dataId == el.id)
        ) {
          console.log(`Game already added to DB - ${el.title}`);
        }
        else {
          if (el.promotions !== null) {
            if (el.promotions.promotionalOffers.length !== 0) {
              if (
                new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].startDate) < date < new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].endDate)
                && el.price.totalPrice.fmtPrice.intermediatePrice == 0
              ) {
                guildsID.forEach(async (guildID) => {
                  const cGuild = client.guilds.cache.get(guildID);
                  const freegamesChannel = await cGuild.channels
                    .fetch()
                    .then((channel) =>
                      channel.find((c) => c.name === "freegames")
                    );
                  var gameImage
                  el.keyImages.forEach(item => {
                    if (item.type === 'Thumbnail' || item.type==="DieselStoreFrontWide") {
                      gameImage = item.url
                    }
                  })
                  try {
                    const epicEmbed = new EmbedBuilder()
                      .setTitle(el.title.toString())
                      .setDescription(el.description.toString())
                      .setImage(gameImage)
                      .setURL(el.productSlug ? `https://store.epicgames.com/en-US/p/${el.productSlug}` :
                        `https://store.epicgames.com/en-US/p/${el.offerMappings[0].pageSlug}`
                      )
                      .addFields([
                        { name: 'Price', value: `Free` },
                        { name: 'Free Until', value: `${new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].endDate).toLocaleDateString()}` }
                      ])
                    freegamesChannel.send({ embeds: [epicEmbed] });
                    console.log(`Added: ${cGuild.name} - ${el.title} `);
                  }
                  catch (err) { client.users.fetch("201652761031475200").then(dm => dm.send(`ERROR: ${err} --- ${el.title}`)) }

                  try {
                    await Mongo.mongoClient.connect();
                    await coll.insertMany([
                      {
                        dataId: el.id,
                        dataName: el.title,
                        dataDate: date.toLocaleDateString(),
                        dataURL: el.productSlug ? `https://store.epicgames.com/en-US/p/${el.productSlug}` : `https://store.epicgames.com/en-US/p/${el.offerMappings[0].pageSlug}`,
                      },
                    ]);
                    await Mongo.mongoClient.close();
                  } catch (err) {}
                })
              }
            }
          }
        }
      })
    );
};
