const WebSocket = require('ws')
const config = require('./config.json')
const osu = new WebSocket(`ws://localhost:${config.port}/ws`)
const scopes = ['rpc', 'rpc.activities.write'];
const DiscordRichPresence = require('discord-rpc')
const PID = process.pid
const client = new DiscordRichPresence.Client({
  'transport': 'ipc'
})
client.login({
  clientId: config.client_id,
  scopes: scopes,
  redirectUri: 'https://github.com/cxtch/gosu-rich-presence',
  clientSecret: config.client_secret,
})
client.on('ready', () => {
  console.log(`sucessfully connected to ${client.user.username}`)
})
let getLetterGrade = (data) => {
  let hasHidden = data.menu.mods.str.match(/HD/g);
  let letter = data.gameplay.hits.grade.current;
  if (letter === 'SS' && hasHidden)
    return 'xh'
  if (letter === 'S' && hasHidden)
    return 'sh'
  return letter.toLowerCase()
}
osu.on('message', (incoming) => {
  let data = JSON.parse(incoming)
  let smallImageKey,
    state = '',
    largeImageText, startTimestamp, endTimestamp;
  if (data.menu.state == 1) {
    state = 'In the editor';
    largeImageText = `editing a ${data.menu.pp["100"]}pp map`
  } else if (data.menu.state == 2) {
    state = `Clicking circles [+${data.menu.mods.str}]`;
    largeImageText = `getting a ${data.gameplay.pp.current}pp play`;
    smallImageKey = getLetterGrade(data);
    startTimestamp = Date.now() - data.menu.bm.time.current;
    endTimestamp = startTimestamp + data.menu.bm.time.full
  } else {
    state = 'Just listening'
    largeImageText = 'idle'
  }
  const presence = {
    largeImageKey: 'logo-main',
    largeImageText: largeImageText,
    smallImageKey: smallImageKey,
    details: `${data.menu.bm.metadata.artist} - ${data.menu.bm.metadata.title} | ${data.menu.bm.metadata.mapper}`,
    state: `${state}`,
    buttons: [{
        label: 'beatmap',
        url: `https://osu.ppy.sh/b/${data.menu.bm.id}`
      },
      {
        label: 'profile',
        url: `https://osu.ppy.sh/users/${config.profile}`
      }
    ],
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp
  }
  if (!presence.smallImageKey)
    delete presence.smallImageKey
  client.setActivity(presence)
})
process.stdin.on('data', (input) => {
  let message = input.toString().toLowerCase().trim();
  if (message === 'exit')
    process.emit('beforeExit')
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