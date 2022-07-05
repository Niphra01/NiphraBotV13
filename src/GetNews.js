require("dotenv").config()
const Mongo = require("./dbServer")
const { MessageEmbed } = require("discord.js")
const dateFormat = (dt) => {
    return (dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate())
        + "/" + (dt.getMonth() < 10 ? "0" + dt.getMonth() : dt.getMonth())
        + "/" + dt.getFullYear()
}

const http = require("https");
const date = new Date();
const options = {
    "method": "GET",
    "hostname": "api.collectapi.com",
    "port": null,
    "path": "/news/getNews?country=tr&tag=general",
    "headers": {
        "content-type": "application/json",
        "authorization": process.env.COLLECT_API_TOKEN
    }
};
async function news(client) {
    await Mongo.mongoClient.connect();
    const findResult = await Mongo.dbo
        .collection("News")
        .find({})
        .toArray();
    await Mongo.mongoClient.close();
    const req = http.request(options, function (res) {
        let chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            let body = Buffer.concat(chunks);
            const data = JSON.parse(body.toString())
            data.result.forEach(async (item) => {
                await Mongo.mongoClient.connect();
                if (findResult.length === 0) {
                    const newsEmbed = new MessageEmbed()
                        .setTitle(`${item.name}`)
                        .setDescription(`${item.description}`)
                        .setURL(item.url)
                        .setImage(item.image)
                        .addField("**Tarih**", `${date.toLocaleDateString()}`, true)
                        .addField("**Gazete**", `${item.source}`, true)
                    client.channels.cache.get("992431216152285264").send({ embeds: [newsEmbed] })
                    try {
                        await Mongo.dbo.collection("News").insertMany([
                            {
                                dataName: item.name,
                                dataURL: item.url,
                                dataSource: item.source,
                                dataDate: dateFormat(date),
                            },
                        ]);
                    } catch (err) { }
                }
                else {
                    if (findResult.some((data) => data.dataURL.includes(item.url))) { }
                    else {
                        const newsEmbed = new MessageEmbed()
                            .setTitle(`${item.name}`)
                            .setDescription(`${item.description}`)
                            .setURL(item.url)
                            .setImage(item.image)
                            .addField("**Tarih**", `${date.toLocaleDateString()}`, true)
                            .addField("**Gazete**", `${item.source}`, true)
                        client.channels.cache.get("992431216152285264").send({ embeds: [newsEmbed] })
                        try {
                            await Mongo.dbo.collection("News").insertMany([
                                {
                                    dataName: item.name,
                                    dataURL: item.url,
                                    dataSource: item.source,
                                    dataDate: dateFormat(date),
                                },
                            ]);
                        } catch (err) { }
                    }

                }
                await Mongo.mongoClient.close();
            });
        });
    });
    req.end();
}

module.exports = { news }