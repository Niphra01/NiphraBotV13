require("dotenv").config();
const { EmbedBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const Mongo = require("./configs/DbConfig");
const fetch = require("node-fetch");
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

    await RedditFetch(client,fGamesResult,channelResult)
    await EpicGames(client,fGamesResult,channelResult)
}
module.exports = { GetGames };


const EpicGames = async (client, fGamesResult,channelResult) => {
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
            data.data.Catalog.searchStore.elements.forEach(async(el) => {
                if (!fGamesResult.some((item) => item.dataId == el.id)) {
                    if (el.price.lineOffers[0].appliedRules.length !== 0 && el.price.totalPrice.discountPrice == 0) {
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
                            await FreegamesChannel(epicEmbed, client,channelResult);
                        }
                        catch (err) { client.users.fetch("201652761031475200").then(dm => dm.send(`ERROR: ${err} --- ${el.title}`)) }

                        await DatabaseAdd(el.id, el.title, gameURL);

                    }
                }
            })
        );
};

const RedditFetch = async(client,fGamesResult,channelResult) =>{
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

                await FreegamesChannel(gameEmbed, client,channelResult);
                await DatabaseAdd(posts[i].id, posts[i].title, posts[i].data.url);
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
                dataDate: date.toLocaleDateString(),
                dataURL: itemURL,
            },
        ]);
        await Mongo.mongoClient.close();
    } catch (err) { }
}

const MongoChannelAdd = async (channelId) => {
    try {
        await Mongo.mongoClient.connect();
        await channelColl.insertMany([
            {
                mChannelId: channelId,
            }
        ])
        await Mongo.mongoClient.close();
    } catch (err) { }
}

const FreegamesChannel = async (embed, client,channelResult) => {
    const guildsID = await client.guilds.fetch().then((guild) => guild.map((x) => x.id));
    guildsID.forEach(async (guildID) => {
        const cGuild = client.guilds.cache.get(guildID);
        const freegamesChannel = await cGuild.channels
            .fetch()
            .then((channel) => channel.find((c) => channelResult.some((item) => item.mChannelId == c.id)));
            console.log(freegamesChannel);
        if (freegamesChannel === undefined) {
            const createdChannel = cGuild.channels.create({
                name: "freegames",
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: cGuild.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            MongoChannelAdd(createdChannel.id);
        }
        freegamesChannel.send({ embeds: [embed] })

    })
}


