const { MessageEmbed } = require("discord.js");
const nodeFetch = require("node-fetch");
require("dotenv").config();
module.exports = {
  name: "reddit",
  async execute(client, message, args) {
    var subreddit = args[0];
    try {
      const targetURL = `https://reddit.com/r/${subreddit}/.json?sort=new`;
      const resp = await nodeFetch(targetURL, {
        Header: { "user-agent": process.env.USERAGENT },
      });
      const body = await resp.json();
      const allowed = message.channel.nsfw
        ? body.data.children
        : body.data.children.filter((post) => !post.data.over_18);
      if (!allowed.length) {
        return message.channel.send(
          "It seems we are out of fresh memes!, Try again later."
        );
      }
      const randomNumber = Math.floor(Math.random() * allowed.length);
      //Video formats
      if (allowed[randomNumber].data.media) {
        if (
          allowed[randomNumber].data.preview.reddit_video_preview.fallback_url
        ) {
          message.channel.send(
            allowed[randomNumber].data.preview.reddit_video_preview.fallback_url
          );
        } else {
          message.channel.send(allowed[randomNumber].data.media.fallback_url);
        }
        console.log(allowed[randomNumber].data);
      }
      //For the gifv and other unsupported format on discord
      else if (allowed[randomNumber].data.preview.reddit_video_preview) {
        message.channel.send(allowed[randomNumber].data.url);
        console.log(allowed[randomNumber].data);
      }
      //Embedded images
      else {
        const embed = new MessageEmbed()
          .setTitle(allowed[randomNumber].data.title)
          .setImage(allowed[randomNumber].data.url)
          .setURL(`https://www.reddit.com${allowed[randomNumber].data.permalink}`)
          .setFooter({ text: `r/${subreddit}` });
        message.channel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
