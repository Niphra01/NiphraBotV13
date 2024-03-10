require("dotenv").config();
const { EmbedBuilder, ChannelType, PermissionsBitField, time } = require("discord.js");
const Mongo = require("./configs/DbConfig");
const fetch = require("node-fetch");
const { logger } = require("./logger");
const date = new Date();
const gamesColl = Mongo.dbo.collection("FetchedGames");
const channelColl = Mongo.dbo.collection("FreegamesChannel");

async function GetGames(client) {
    await Mongo.mongoClient.connect();

    //finding all the data to array in FetchedGames collection from database
    const fGamesResult = await gamesColl.find({}).toArray();
    const channelResult = await channelColl.find({}).toArray();

    //deleting a document if document has been in db more than 29 days
    await fGamesResult.forEach(async (item) => {
        var dt = new Date(item.dataDate);
        if (Math.floor(Math.abs(date - dt) / 1000 / 60 / 60 / 24) >= 30) {
            await gamesColl.deleteOne({ dataId: item.dataId });
        }
    });
    await EpicGames(client, fGamesResult, channelResult)
    await RedditFetch(client, fGamesResult, channelResult)

}
module.exports = { GetGames };


const EpicGames = async (client, fGamesResult, channelResult) => {
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
            data.data.Catalog.searchStore.elements.forEach(async (el) => {

                if (!fGamesResult.some((item) => item.dataId == el.id)) {
                    if (el.promotions !== null && el.promotions.promotionalOffers.length !== 0) {
                        if (el.promotions.promotionalOffers[0].promotionalOffers[0].startDate < Date.now() !== 0 && el.price.totalPrice.discountPrice == 0) {
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
                                        { name: 'Free Until', value: `${time(new Date(el.promotions.promotionalOffers[0].promotionalOffers[0].endDate), "f")}` }
                                    ])
                                await DatabaseAdd(el.id, el.title, gameURL);
                                await FreegamesChannel(epicEmbed, client, channelResult);

                            }
                            catch (err) {
                                logger.error(`${err} --- ${el.title}`);
                            }
                        }
                    }
                }
            })
        );
};

const RedditFetch = async (client, fGamesResult, channelResult) => {
    const conditions = [
        "gog.com",
        "store.ubi",
        "origin.com",
        "ea.com",
        "xbox.com",
    ];
    const dataFlair = ["Commercial Game"];
    //Getting posts from the freegames subreddits
    const targetURL = "https://reddit.com/r/freegames/new/.json?limit=25";
    const resp = await fetch(targetURL, {
        Header: { "user-agent": process.env.USERAGENT },
    });
    const res = await resp.json();
    const posts = res.data.children;

    for (var i = 0; i < posts.length; i++) {
        //Checking if the data is already in the database
        if (dataFlair.some((el) => posts[i].data.link_flair_text?.includes(el) || true) && conditions.some((c) => posts[i].data.url.includes(c))) {
            //If the data is not in the database, adding it
            if (!fGamesResult.some((item) => item.dataURL == posts[i].data.url)) {
                const gameEmbed = new EmbedBuilder()
                    .setTitle(posts[i].data.title.toString())
                    .setImage(posts[i].data.thumbnail)
                    .setURL(posts[i].data.url)
                    .addFields([
                        { name: 'Price', value: `Free` }
                    ])
                await DatabaseAdd(posts[i].data.id, posts[i].data.title, posts[i].data.url);
                await FreegamesChannel(gameEmbed, client, channelResult);

            }
        }
    }
}


const DatabaseAdd = async (itemId, itemTitle, itemURL) => {
    try {
        await Mongo.mongoClient.connect();
        await gamesColl.insertMany([
            {
                dataId: itemId,
                dataName: itemTitle,
                dataDate: date,
                dataURL: itemURL,
            },
        ]);
        await Mongo.mongoClient.close();
    } catch (err) {
        logger.error(`Something went wrong when adding Game Info to the collection.`, err);
    }
}

const FreegamesChannel = async (embed, client, channelResult) => {

    channelResult.forEach(async (fGuild)=>{
        const freeGamesGuild = await client.guilds.cache.get(fGuild.mGuildId);
        const freeGamesChannel = await freeGamesGuild.channels.cache.get(fGuild.mChannelId)
        try {
            await freeGamesChannel.send({ embeds: [embed] });
        }
        catch (err) {
            logger.error(`Channel is not available on database or there is an error[${err}]}.`);
        }
    })

}


