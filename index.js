const WebSocket = require('ws')
let config = require('./config.json')
const osu = new WebSocket(`ws://localhost:${config.port}/ws`)
osu.once('error', (e) => {
    if (e.message.startsWith('connect ECONNREFUSED'))
        throw new Error('Make sure gosu-memory is running!')
})
const DiscordRichPresence = require('discord-rpc')
const PID = process.pid
const client = new DiscordRichPresence.Client({
    'transport': 'ipc'
})
client.on('ready', () => {
    console.log(`sucessfully connected to ${client.user.username}`)
})
let getLetterGrade = (data) => {
    let hasHidden = data.menu.mods.str.match(/HD/g);
    let letter = data.gameplay.hits.grade.current;
    if (letter === 'SS' && hasHidden)
        return 'ssh'
    if (letter === 'S' && hasHidden)
        return 'sh'
    return letter.toLowerCase()
}
let resolveObjectPath = (obj, path) => {
    let pathArray = path.split('.');
    for (let prop of pathArray) {
        obj = obj[prop]
    }
    return obj
}
const mappings = (() => {
    let map = new Map()
    let array = require('./mappings.json')
    array.map((a) => map.set(a.alias, a.path))
    return map
})()
let createImageText = (data) => {
    let originalText;
    if (data.menu.state == 1)
        originalText = config.inEditorText;
    else if (data.menu.state == 2)
        originalText = config.inGameText;
	  else if (data.menu.state == 7)
	  originalText = config.resultText;
    let aliases = originalText.match(/(?<=\${)\S+(?=})/gm)
    let result = originalText
    try {
        for (let x of aliases) {
            let path = mappings.get(x)
            let value = resolveObjectPath(data, path)
            result = result.replace(`\${${x}}`, value)
        }
    } catch (err) {
        throw new Error(err)
    }
    return result
}
let lastUpdate = Date.now()
osu.on('message', (incoming) => {
    if (Date.now() - lastUpdate < config.update_rate)
        return
    lastUpdate = Date.now()
    let data = JSON.parse(incoming)
    let buttonText = 'profile'
    let smallImageKey,
        state = '',
        smallImageText, largeImageText, startTimestamp, endTimestamp;
    if (data.menu.state == 1) {
        state = 'In the editor';
        largeImageText = createImageText(data);
        if (config.customButtonText) buttonText = largeImageText
    } else if (data.menu.state == 2) {
        state = `[${data.menu.bm.metadata.difficulty}] +${data.menu.mods.str} | ${data.menu.bm.stats.fullSR}★`;
		    largeImageText = `Current PP: ${data.gameplay.pp.current} | Max PP: ${data.gameplay.pp.maxThisPlay} | Max PP if FC: ${data.gameplay.pp.fc}`
        smallImageKey = getLetterGrade(data);
		    smallImageText = `Sliderbreaks: ${data.gameplay.hits.sliderBreaks} | Misses: ${data.gameplay.hits[0]}`
		let modsPlaying = data.menu.mods.str;
		async function checkRound(time) {
			if (time - Math.floor(time) < 0.5) {
				time = Math.floor(time);
			} else {
				time = Math.floor(time) + 1;
			}
		}
		if (modsPlaying.includes("DT")) {
			  startTimestamp = Date.now() - (data.menu.bm.time.current / 1.5);
		    endTimestamp = startTimestamp + (data.menu.bm.time.full / 1.5);
			  checkRound(startTimestamp);
			  checkRound(endTimestamp);
		} else if (modsPlaying.includes("HT")) {
			  startTimestamp = Date.now() - (data.menu.bm.time.current * (4/3));
		    endTimestamp = startTimestamp + (data.menu.bm.time.full * (4/3));
			  checkRound(startTimestamp);
			  checkRound(endTimestamp);
		} else {
			  startTimestamp = Date.now() - data.menu.bm.time.current;
    	  endTimestamp = startTimestamp + data.menu.bm.time.full;
			  checkRound(startTimestamp);
			  checkRound(endTimestamp);
		}
        if (config.customButtonText) buttonText = createImageText(data);
    } else if (data.menu.state == 7) {
        state = 'Result screen'
		    smallImageKey = getLetterGrade(data);
		    largeImageText = `Current PP: ${data.gameplay.pp.current} | Max PP: ${data.gameplay.pp.maxThisPlay} | Max PP if FC: ${data.gameplay.pp.fc}`
		    smallImageText = `Sliderbreaks: ${data.gameplay.hits.sliderBreaks} | Misses: ${data.gameplay.hits[0]}`
		if (config.customButtonText) buttonText = createImageText(data);
    } else {
        state = 'Just listening'
    }
    let profileUrl = (() => {
        if (!config.private_server)
            return `https://osu.ppy.sh/users/${config.profile}`
        return `https://${config.private_server}/${config.profile}`
    })()
    const presence = {
        largeImageKey: 'osu',
        largeImageText: largeImageText,
        smallImageKey: smallImageKey,
		    smallImageText: smallImageText,
		    details: `${data.menu.bm.metadata.title} | Mapped by ${data.menu.bm.metadata.mapper}`,
        state: `${state}`,
        buttons: 
		    [	
			      {
                label: 'beatmap',
                url: `https://osu.ppy.sh/b/${data.menu.bm.id}`
            },
            {
                label: buttonText,
                url: profileUrl
            }
        ],
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp
    }
    if (!config.smallImageKey)
        delete presence.smallImageKey
    if (!presence.smallImageKey)
        delete presence.smallImageKey
    if (!presence.largeImageText)
        delete presence.largeImageText
    client.setActivity(presence)
})
process.stdin.on('data', (input) => {
    let message = input.toString().toLowerCase().trim();
    if (message === 'exit')
        process.emit('beforeExit')
    if (message === 'reload') {
        config = require('./config.json')
        console.log('Config reloaded!')
    }
})
process.on('uncaughtException', (e) => {
    console.log(e)
    process.emit('beforeExit')
})
process.on('beforeExit', () => {
    console.log('exiting')
    client.clearActivity(PID).catch((err) => {})
    process.exit()
})
client.login({
    clientId: config.client_id,
    redirectUri: 'https://github.com/cxtch/gosu-rich-presence',
    clientSecret: config.client_secret,
})
