var Mongo = require("./dbServer.js");

const nodeFetch = require("node-fetch");

async function getPosts(client) {
  await Mongo.mongoClient.connect();

  const findResult = await Mongo.dbo
    .collection("FetchedGames")
    .find({})
    .toArray();

  const targetURL = "https://reddit.com/r/GameDeals/new/.json?limit=50";
  const resp = await nodeFetch(targetURL, {
    Header: { "user-agent": process.env.USERAGENT },
  });
  const data = await resp.json();
  const hasData = data.data.children;
  for (var i = 0; i < hasData.length; i++) {
    if (hasData[i].data.title.includes("Free", "FREE", "free")) {
      {
        if (
          findResult.forEach((item) => {
            item.dataId !== hasData[i].data.id;
          }) ||
          findResult.length === 0
        ) {
          await Mongo.dbo.collection("FetchedGames").insertMany([
            {
              dataId: [hasData[i].data.id],
            },
          ]);
          client.channels.cache
            .get("971813922418073600")
            .send(hasData[i].data.url);
        }
      }
    }
  }
  await Mongo.mongoClient.close();
}
module.exports = { getPosts, setInterval };
