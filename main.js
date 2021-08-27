module.exports = () => {
  const WebSocket = require('ws');
  let config_outline = require('./config.json');
  const fs = require('fs');
  if (!fs.existsSync('rpc-config.ini'))
    fs.writeFileSync('rpc-config.ini', JSON.stringify(config_outline).replace(/((?<="))?,(?=")/gm, ',\n'));
  this.config = JSON.parse(fs.readFileSync('rpc-config.ini'));
  const osu = new WebSocket(`ws://localhost:${this.config.port}/ws`);
  osu.once('error', (e) => {
    if (e.message.startsWith('connect ECONNREFUSED'))
      throw new Error('Make sure gosu-memory is running!');
  })
  this.cache = {};
  const DiscordRichPresence = require('discord-rpc');
  const PID = process.pid;
  const client = new DiscordRichPresence.Client({
    'transport': 'ipc'
  });
  client.on('ready', () => {
    console.log(`Successfully connected to ${client.user.username}.`);
    console.log(`If it's not displayed on Discord. osu! has priority.`);
    console.log(`Go to your in-game settings and turn off rich presence.`);
  })
  const {
    getLetterGrade,
    resolveObjectPath,
    checkRound
  } = require('./utils')
  const mappings = (() => {
    let map = new Map()
    let array = require('./mappings.json')
    array.map((a) => map.set(a.alias, a.path))
    return map
  })()
  let createImageText = (data) => {
    let originalText;
    if (data.menu.state == 1)
      originalText = this.config.inEditorText;
    else if (data.menu.state == 2)
      originalText = this.config.inGameText;
    else if (data.menu.state == 7)
      originalText = this.config.resultText;
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
  let start = Date.now()
  osu.on('message', (incoming) => {
    if (Date.now() - lastUpdate < this.config.update_rate)
      return
    lastUpdate = Date.now()
    let data = JSON.parse(incoming)
    let buttonText = 'Profile'
    let profileUrl = (() => {
      if (!this.config.private_server)
        return `https://osu.ppy.sh/users/${this.config.profile}`
      return `https://${this.config.private_server}/${this.config.profile}`
    })()
    let smallImageKey,
      state = '',
      smallImageText, largeImageText, startTimestamp, endTimestamp;
    //if in the editor
    if (data.menu.state == 1) {
      try {
        if (this.cache.menu.state != 1)
          start = Date.now();
      } catch (err) {
        //if this.cache.menu is undefined
        start = Date.now()
      }
      startTimestamp = start
      state = 'In the editor';
      largeImageText = createImageText(data);
      if (this.config.customButtonText) buttonText = largeImageText;
    } else if (data.menu.state == 2) {
      //if in game
      state = `[${data.menu.bm.metadata.difficulty}] +${data.menu.mods.str} | ${data.menu.bm.stats.fullSR}★`;
      largeImageText = `Current PP: ${data.gameplay.pp.current} | Max PP: ${data.gameplay.pp.maxThisPlay} | Max PP if FC: ${data.gameplay.pp.fc}`;
      smallImageKey = getLetterGrade(data);
      smallImageText = `Sliderbreaks: ${data.gameplay.hits.sliderBreaks} | Misses: ${data.gameplay.hits[0]}`;
      let modsPlaying = data.menu.mods.str;
      if (modsPlaying.includes("DT")) {
        startTimestamp = Date.now() - (data.menu.bm.time.current / 1.5);
        endTimestamp = startTimestamp + (data.menu.bm.time.full / 1.5);
        checkRound(startTimestamp);
        checkRound(endTimestamp);
      } else if (modsPlaying.includes("HT")) {
        startTimestamp = Date.now() - (data.menu.bm.time.current * (4 / 3));
        endTimestamp = startTimestamp + (data.menu.bm.time.full * (4 / 3));
        checkRound(startTimestamp);
        checkRound(endTimestamp);
      } else {
        startTimestamp = Date.now() - data.menu.bm.time.current;
        endTimestamp = startTimestamp + data.menu.bm.time.full;
        checkRound(startTimestamp);
        checkRound(endTimestamp);
      }
      if (this.config.customButtonText)
        buttonText = createImageText(data);
      if (this.config.spectate_button)
        profileUrl = `osu://spectate/${this.config.profile}`;
    } else if (data.menu.state == 7) {
      //if in result screen
      state = 'Result screen';
      smallImageKey = getLetterGrade(data);
      largeImageText = `Current PP: ${data.gameplay.pp.current} | Max PP: ${data.gameplay.pp.maxThisPlay} | Max PP if FC: ${data.gameplay.pp.fc}`;
      smallImageText = `Sliderbreaks: ${data.gameplay.hits.sliderBreaks} | Misses: ${data.gameplay.hits[0]}`;
      if (this.config.customButtonText) buttonText = createImageText(data);
    } else {
      //assume all other states are when the player is idle
      state = 'Just listening';
    }
    const presence = {
      largeImageKey: this.config.largeImageKey,
      largeImageText: largeImageText,
      smallImageKey: smallImageKey,
      smallImageText: smallImageText,
      details: `${data.menu.bm.metadata.title} | Mapped by ${data.menu.bm.metadata.mapper}`,
      state: `${state}`,
      buttons: [{
          label: 'Beatmap',
          url: `https://osu.ppy.sh/b/${data.menu.bm.id}`
        },
        {
          label: buttonText,
          url: encodeURI(profileUrl)
        }
      ],
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp
    }
    if (!this.config.smallImageKey)
      delete presence.smallImageKey;
    if (!presence.smallImageKey)
      delete presence.smallImageKey;
    if (!presence.largeImageText)
      delete presence.largeImageText;
    if (!presence.endTimestamp)
      delete presence.endTimestamp;
    this.cache = data
    client.setActivity(presence)
  })
  this.commands = new Map()
  //set commands manually because pkg does not allow dynamic imports
  this.commands.set('exit', require('./commands/exit.js'))
  this.commands.set('test', require('./commands/test.js'))
  this.commands.set('np', require('./commands/np.js'))
  this.commands.set('help', require('./commands/help.js'))
  this.commands.set('config', require('./commands/config.js'))
  process.stdin.on('data', (input) => {
    let args = input.toString().toLowerCase().trim().split(/(?<!"\w+)\s/gm);
    if (this.commands.has(args[0])) {
      try {
        this.commands.get(args[0]).run(this, args)
      } catch (err) {
        console.log(err)
      }
    } else
      console.log('command not found!', args[0])
  })
  process.on('uncaughtException', (e) => {
    fs.writeFileSync('error.txt', `${e.stack}`)
    console.log(e)
    process.emit('beforeExit')
  })
  process.on('beforeExit', () => {
    console.log('exiting')
    client.clearActivity(PID).catch((err) => {})
    process.exit()
  })
  client.login({
    clientId: this.config.client_id,
    redirectUri: 'https://github.com/cxtch/gosu-rich-presence',
  })
}