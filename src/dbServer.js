const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const mongoClient = new MongoClient(url);
const dbo = mongoClient.db("BotDB");

module.exports = {
  dbo,
  mongoClient,
};
