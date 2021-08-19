const WebSocket = require('ws')
let config_outline = require('./config.json')
const fs = require('fs');
if (!fs.existsSync('rpc-config.ini'))
  fs.writeFileSync('rpc-config.ini', JSON.stringify(config_outline).replace(/((?<="))?,(?=")/gm, ',\n'));
this.config = JSON.parse(fs.readFileSync('rpc-config.ini'));
let wait = () => {
  let osu = new WebSocket(`ws://localhost:${this.config.port}/ws`)
  osu.on('error', (e) => {
    console.log('error: port not open, waiting')
    setTimeout(() => {
      wait()
    }, 3000)
  })
  osu.once('message', (data) => {
    require('./main')()
  })
}
wait()