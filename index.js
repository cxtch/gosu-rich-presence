const WebSocket = require('ws')
const config = require('./config.json')
const osu = new WebSocket(`ws://localhost:${config.port}/ws`)
const scopes = ['rpc', 'rpc.activities.write'];
const DiscordRichPresence = require('discord-rpc')
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
osu.on('message', (incoming) => {
  let data = JSON.parse(incoming)
  let state = '';
  if (data.menu.state == 1)
    state = 'In the editor';
  if (data.menu.state == 2);
  state = `Clicking circles [${data.menu.mods.str}]`
  client.setActivity({
    largeImageKey: 'logo-main',
    largeImageText: `getting a ${data.gameplay.pp.current}pp play`,
    details: `${data.menu.bm.metadata.artist} - ${data.menu.bm.metadata.title} | ${data.menu.bm.metadata.mapper}`,
    state: `${state}`,
    buttons: [{
        label: 'beatmap',
        url: `https://osu.ppy.sh/b/${data.menu.bm.id}`
      },
      {
        label: 'profile',
        url: `https://osu.ppy.sh/u/${config.profile}`
      }
    ]
  })
})