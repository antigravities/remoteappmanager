const Steam = require("steam-user");
const fetch = require("node-fetch");
const yargs = require("yargs");

const argv = yargs
    .option("appid", {
        alias: "a",
        description: "The app ID to install (i.e. the number part of store.steampowered.com URLs).",
        type: "number"
    })
    .option("username", {
        alias: "u",
        description: "Your account name.",
        type: "string"
    })
    .option("password", {
        alias: "p",
        description: "Your password.",
        type: "string"
    })
    .help()
    .argv;

let bot = new Steam();

async function postWithCookies(url, data, sessionID, cookies){
    return await (await fetch(url, {
        headers: {
            "Accept": "*/*",
            "Cookie": cookies.join(";"),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: data
    })).text();
}

async function install(appid, sessionID, cookies){
    let status = JSON.parse(await postWithCookies("https://steamcommunity.com/remoteactions/modifyappstate", `sessionid=${sessionID}&appid=${appid}&operation=install`, sessionID, cookies));

    if( status.success !== 1 ){
        console.log("Error: " + status.errorText);
        return;
    }

    console.log("Downloading app. This may take a while, depending on the internet connection of the remote machine. You will be notified when the download is complete.");

    setInterval(async () => {
        try {
            let html = await postWithCookies("https://steamcommunity.com/my/getchanging", "xml=1", sessionID, cookies);

            let inf = /UpdateChangingGames\((.*)\)/.exec(html);
            let sum = JSON.parse(inf[1]).summaries;

            if( ! sum[appid] ) {
                return;
            }

            if( sum[appid].state && sum[appid].state == "installed" ){
                console.log("Done! " + sum[appid].localContentSize + " installed");
                process.exit(0);
            }
        } catch(e){
            console.log("Error fetching install info: " + e)
        }
    }, 2500);
}

bot.on("loggedOn", () => {
    console.log("Logged on to Steam.");
});

bot.on("webSession", (sessionID, cookies) => {
    install(argv.appid, sessionID, cookies)
});

bot.logOn({
    accountName: argv.username,
    password: argv.password
});