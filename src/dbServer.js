require("dotenv").config();

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://Niphra:${process.env.MONGOPASSWORD}@cluster0.hl4zr.mongodb.net/?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);

const dbo = mongoClient.db("BotDB");

module.exports = {
  dbo,
  mongoClient,
};
