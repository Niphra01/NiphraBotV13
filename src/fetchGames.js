var Mongo = require("./dbServer");

const nodeFetch = require("node-fetch");
const date = new Date();

async function getPosts(client) {
  await Mongo.mongoClient.connect();

  //finding all the data to array in FetchedGames collection from database
  const findResult = await Mongo.dbo
    .collection("FetchedGames")
    .find({})
    .toArray();

  //Getting posts from the freegames subreddit
  const targetURL = "https://reddit.com/r/freegames/new/.json?limit=15";
  const resp = await nodeFetch(targetURL, {
    Header: { "user-agent": process.env.USERAGENT },
  });
  const res = await resp.json();
  const posts = res.data.children;

  //Checking collection has data in it
  if (findResult.length === 0) {
    for (var i = 0; i < posts.length; i++) {
      if (posts[i].data.link_flair_text === "Commercial Game") {
        await Mongo.dbo.collection("FetchedGames").insertMany([
          {
            dataId: [posts[i].data.id],
            dataName: [posts[i].data.title],
            dataDate: [date.toLocaleDateString()],
          },
        ]);
        client.channels.cache
          .get("373764394385014786")
          .send(
            `${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url} `
          );
      }
    }
  } else {
    for (var i = 0; i < posts.length; i++) {

      if (posts[i].data.link_flair_text === "Commercial Game") {
        //Checking if the data is already in the database
        if (
          findResult.some((item) => item.dataId.includes(posts[i].data.id))
        ) {
        }
        //If the data is not in the database, adding it
        else {
          client.channels.cache
            .get("373764394385014786")
            .send(
              `${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url}`
            );
          await Mongo.dbo.collection("FetchedGames").insertMany([
            {
              dataId: [posts[i].data.id],
              dataName: [posts[i].data.title],
              dataDate: [date.toLocaleDateString()],
            },
          ]);
          console.log(`Eklendi: ${posts[i].data.title} (Free/100% Off)`);
        }
      }
    }
  }

  await Mongo.mongoClient.close();
}
module.exports = { getPosts };
