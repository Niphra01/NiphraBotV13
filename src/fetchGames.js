var Mongo = require("./dbServer.js");

const nodeFetch = require("node-fetch");
const date = new Date();
sentGames = [];
setInterval(getPosts, 1000 * 60 * 60);
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

  const conditions = ["free", "Free", "FREE"];

  if (findResult.length === 0) {
    for (var i = 0; i < hasData.length; i++) {
      if (conditions.some((el) => hasData[i].data.title.includes(el))) {
        await Mongo.dbo.collection("FetchedGames").insertMany([
          {
            dataId: [hasData[i].data.id],
            dataName: [hasData[i].data.title],
            dataDate: [date.toLocaleDateString()],
          },
        ]);
        client.channels.cache
          .get("971813922418073600") //971813922418073600  ,,  373764394385014786
          .send(
            `@everyone ${hasData[i].data.title}  \n ${hasData[i].data.url}`
          );
      }
    }
  } else {
    for (var i = 0; i < hasData.length; i++) {
      if (conditions.some((el) => hasData[i].data.title.includes(el))) {
        if (
          findResult.some((item) => item.dataId.includes(hasData[i].data.id))
        ) {
          break;
        } else {
          console.log(`Eklendi: ${hasData[i].data.title}`);
          await Mongo.dbo.collection("FetchedGames").insertMany([
            {
              dataId: [hasData[i].data.id],
              dataName: [hasData[i].data.title],
              dataDate: [date.toLocaleDateString()],
            },
          ]);
          client.channels.cache
            .get("373764394385014786") //971813922418073600  ,,  373764394385014786
            .send(
              `@everyone ${hasData[i].data.title}  \n ${hasData[i].data.url}`
            );
        }
      }
    }
  }

  await Mongo.mongoClient.close();
}
module.exports = { getPosts, setInterval };
