var Express = require('express')
const request = require(`request`)
const app = Express()
const axios = require('axios');
var bodyParser = require('body-parser')
const crypto = require('crypto')
const {machineId, machineIdSync} = require('node-machine-id')
const fs = require('fs')




async function getMachineId() {
    let id = await machineId();

}


(async () => {


    let msg = await axios.get(`https://px1-v2api.herokuapp.com/msg`, {})

    console.log(msg.data.msg)


    const path = './key.txt'



})();

var v = "V19"


app.use(bodyParser.json())


crypto.randomBytes(16, (err, buf) => {

})


async function getCookieAuth(input, callback) {
    if (checkCookie(input)) {
        const req = request.defaults()
        XSRF = req.post({
            url: `https://auth.roblox.com/v1/authentication-ticket`,
            headers: {
                "Cookie": `.ROBLOSECURITY=${input}`,
                "User-Agent": `Roblox/WinInet`,
                "Referer": 'https://www.roblox.com/develop',
                "RBX-For-Gameauth": 'true'
            }
        }, (e, r, b) => {
            if (e) console.error(e)
            req.post({
                url: `https://auth.roblox.com/v1/authentication-ticket`,
                headers: {
                    "Cookie": `.ROBLOSECURITY=${input}`,
                    "User-Agent": "Roblox/WinInet",
                    "Referer": "https://www.roblox.com/develop",
                    "RBX-For-Gameauth": "true",
                    "X-CSRF-TOKEN": r.headers['x-csrf-token']
                }
            }, (z, d, x) => {
                if (z) console.error(z)
                callback(d.headers['rbx-authentication-ticket'])
            })
        })
    } else {
        log(`Invalid cookie: '${input}'.`)
    }
}


async function checkCookie(input) {
    const req = request.defaults()

    req.get({
        url: `https://roblox.com/mobileapi/userinfo`,
        headers: {
            "Cookie": `.ROBLOSECURITY=${input}`
        }
    }, (e, r, b) => {
        if (e) console.error(e)
        return (b.length < 250)
    })
}


function log(input) {
    if (input) console.log(`[Alt Bot]: ${input.toString()}`)
}


app.get(`/start`, async (req, res) => {

    res.header("Content-Type", "text/plain; charset=utf-8");
    var Key = req.query.GameKey
    var GameId = req.query.id
    let id = machineIdSync()


    if (Key) {


        let resq = await axios.get(`https://px1-v2api.herokuapp.com/start?GameKey=${Key}&hwid=${id}`, {})

        if (resq.data.ver == v) {
            if (resq.data.message !== "Please Refresh the page") {


                if (resq.data.error == false) {


                    var key = "";


                    const haship = resq.data.hashedip


                    var decrypt = crypto.createDecipher('aes-128-cbc', key + id + haship);
                    var s = decrypt.update(resq.data.cookie, 'hex', 'utf8');
                    s += decrypt.final('utf8');


                    var Cookie = s


                    var CookieIsValid = checkCookie(Cookie)
                    if (CookieIsValid) {
                        getCookieAuth(Cookie, (Authcode) => {
                            var Time = Math.floor(+new Date())
                            if (resq.data.vcode == null) {


                                res.redirect(`roblox-player:1+launchmode:play+gameinfo:${Authcode}+launchtime:${Time}+placelauncherurl:https%3A%2F%2Fassetgame.roblox.com%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestGame%26browserTrackerId%3D71726228327%26placeId%3D${resq.data.gameid}%26isPlayTogetherGame%3Dfalse+browsertrackerid:71726228327+robloxLocale:en_us+gameLocale:en_us+channel:`)

                            } else {
                                res.redirect(`roblox-player:1+launchmode:play+gameinfo:${Authcode}+launchtime:${Time}+placelauncherurl:https%3A%2F%2Fassetgame.roblox.com%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestPrivateGame%26placeId%3D${resq.data.gameid}%26linkCode%3D${resq.data.vcode}+robloxLocale:en_us+gameLocale:en_us+channel:`)
                            }

                        })
                    }


                } else {
                    res.send(resq.data.message)
                }
            } else {
                res.send(resq.data.message)
            }

        } else {
            res.redirect(`https://github.com/px1club/web/releases/tag/${resq.data.ver}`)
        }


    } else {
        res.send("pls provide an id")
    }




})


app.listen(80, () => {

})