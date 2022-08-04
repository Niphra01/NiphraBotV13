require('dotenv').config()
const fetch = require('node-fetch')
const http = require('https')
const options = {
    "method": "get",
    "hostname": "api.epicgames.dev",
    "port": null,
    "path": "/ISteamApps/GetAppList/v2/",
    "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "authorization": process.env.EPIC_API_KEY
    }
}

const epicGames = async () => {

    const api_uri = `https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=tr-TR&country=tr&allowCountries=tr`
    const resp = await fetch(api_uri, {
        Header: { "user-agent": process.env.USERAGENT },
    })
    const data = resp.json()

    console.log(data)


    // const req = http.request(options, function (res) {
    //     let chunks = []
    //     res.on('data', function (chunk) {
    //         chunks.push(chunk)
    //     })

    //     res.on('end', function () {
    //         let body = Buffer.concat(chunks)
    //         let data = JSON.parse(body.toString())
    //     })
    // })
    // req.end()
}

module.exports = { epicGames }