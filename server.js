require('dotenv').config()

const http = require('http');
const express = require('express');
const app = express();
var keepAlive = require("node-keepalive");
keepAlive({}, app);
var server = require('http').createServer(app);
var rsCount = 1;
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
  //response.sendFile(__dirname +"/views/index.html");
});

app.get("/keepalive", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
  //response.sendFile(__dirname +"/views/index.html");
});

const listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/keepalive`);
  console.log('Bot restarted.')
  rsCount++;
}, 280000);

// const express = require('express');
// const keepalive = require('express-glitch-keepalive');

// const app = express();

// app.use(keepalive);

// app.get('/', (req, res) => {
//   res.json('This bot should be online! Uptimerobot will keep it alive');
// });
// app.get("/", (request, response) => {
//   response.sendStatus(200);
// });
// app.listen(process.env.PORT);