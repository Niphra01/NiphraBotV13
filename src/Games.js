require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
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
    const dataFlair = ["Commercial Game"];
    //Getting posts from the freegames subreddits
    const targetURL = "https://reddit.com/r/freegames/new/.json?limit=10";
    const resp = await fetch(targetURL, {
        Header: { "user-agent": process.env.USERAGENT },
    });
    const res = await resp.json();
    const posts = res.data.children;
    const guildsID = await client.guilds.fetch().then((guild) => guild.map((x) => x.id));

    guildsID.forEach(async (guildID) => {
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
        }
        for (var i = 0; i < posts.length; i++) {
            //Checking if the data is already in the database
            if (dataFlair.some((el) => posts[i].data.link_flair_text?.includes(el) || true) && conditions.some((c) => posts[i].data.url.includes(c))) {
                //If the data is not in the database, adding it
                if (!findResult.some((item) => item.dataURL == posts[i].data.url)) {
                    await freegamesChannel.send(`${posts[i].data.title} (Free/100% Off) \n ${posts[i].data.url}`);
                    databaseAdd(posts[i].id, posts[i].title, posts[i].data.url);
                }
            }
        }
    });
    await epicGames(client, guildsID, findResult)
}
module.exports = { getGames };


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
                if (!findResult.some((item) => item.dataId == el.id)) {
                    if (el.price.lineOffers[0].appliedRules.length !== 0 && el.price.totalPrice.discountPrice == 0) {
                        console.log(el.title)
                        guildsID.forEach(async (guildID) => {
                            const cGuild = client.guilds.cache.get(guildID);
                            const freegamesChannel = await cGuild.channels
                                .fetch()
                                .then((channel) =>
                                    channel.find((c) => c.name === "freegames")
                                );
                            var gameImage
                            el.keyImages.forEach(item => {
                                if (item.type === 'Thumbnail' || item.type === "DieselStoreFrontWide") {
                                    gameImage = item.url
                                }
                            })
                            var gameURL = el.productSlug != null ? `https://store.epicgames.com/en-US/p/${el.productSlug}` :
                                `https://store.epicgames.com/en-US/p/${el.catalogNs.mappings[0].pageSlug}`;
                            try {
                                const epicEmbed = new EmbedBuilder()
                                    .setTitle(el.title.toString())
                                    .setDescription(el.description.toString())
                                    .setImage(gameImage)
                                    .setURL(gameURL)
                                    .addFields([
                                        { name: 'Price', value: `Free` },
                                        { name: 'Free Until', value: `${new Date(el.price.lineOffers[0].appliedRules[0].endDate).toLocaleDateString()}` }
                                    ])
                                freegamesChannel.send({ embeds: [epicEmbed] });
                                console.log(`Added: ${cGuild.name} - ${el.title} `);
                            }
                            catch (err) { client.users.fetch("201652761031475200").then(dm => dm.send(`ERROR: ${err} --- ${el.title}`)) }

                            databaseAdd(el.id, el.title, gameURL);
                        })
                    }
                }
            })
        );
};

const databaseAdd = async (itemId, itemTitle, itemURL) => {
    try {
        await Mongo.mongoClient.connect();
        await coll.insertMany([
            {
                dataId: itemId,
                dataName: itemTitle,
                dataDate: date.toLocaleDateString(),
                dataURL: itemURL,
            },
        ]);
        await Mongo.mongoClient.close();
    } catch (err) { }
}


