require('dotenv').config()
const fs = require('fs')


const http = require("https");
const options = {
    "method": "GET",
    "hostname": "api.steampowered.com",
    "port": null,
    "path": "/ISteamApps/GetAppList/v2/",
    "headers": {
        "content-type": "application/json",
        "authorization": process.env.Steam_API_KEY
    }
};
async function Steam_Api() {
    const req = http.request(options, function (res) {
        let chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            let body = Buffer.concat(chunks);
            const data = JSON.parse(body.toString())
            fs.writeFileSync('./src/configs/steamAppsInfo.json', JSON.stringify(data), { flag: 'w' }, err => {
                // Checking for errors
                if (err) throw err;
                console.log("Done writing"); // Success
            });
        });
    });
    req.end();
}



module.exports = { Steam_Api }