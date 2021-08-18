module.exports = {
  description: "Edit your configuration values",
  run(_this, args) {
    args.shift();
    if (args[0] === "set") {
      if (!args[1] || !args[2]) {
        console.log('Improper usage! Example: config set profile "foo bar"')
        return
      }
      if (typeof _this.config[args[1]] == 'undefined') {
        console.log(`value ${args[1]} does not exist on the config`)
        return
      }
      _this.config[args[1]] = args[2].replace(/"/g, '')
      const fs = require('fs')
      fs.writeFileSync('rpc-config.ini', JSON.stringify(_this.config).replace(/((?<="))?,(?=")/gm, ',\n'));
      console.log(_this.config)
    } else {
      console.log(_this.config[args[0]])
    }
  }
}