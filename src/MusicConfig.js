module.exports = {
    opt: {
        selfDeaf: false, //IF YOU WANT TO DEAF THE BOT, set false to true.
        maxVol: 100, //You can specify the maximum volume level.
        loopMessage: false, //Please don't touch
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio', //Please don't touch
                highWaterMark: 1 << 25 //Please don't touch
            }
        }
    }
};
