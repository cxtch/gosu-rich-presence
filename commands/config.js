module.exports = {
  description: "Edit your configuration values",
  run(_this, args) {
    args.shift();
    if (args[0] === "set") {
      if (!args[1] || !args[2]) {
        console.log('Improper usage! Example: config set profile "foo bar"');
        return
      }
      if (typeof _this.config[args[1]] == 'undefined') {
        console.log(`value ${args[1]} does not exist on the config`)
        return
      }
      let value = args[2].replace(/"/g, '');
      if (typeof _this.config[args[1]] == 'number') {
        if (+value === NaN) {
          console.log("cannot be converted to a number", value);
          return
        }
        value = +value;
      }
      if (typeof _this.config[args[1]] == 'boolean') {
        if (value === "false" || value === "true" || value == 0 || value == 1) {
          switch (value) {
            case "false":
              value = false;
              break
            case "true":
              value = true;
              break
            case "0":
              value = false
              break
            case "1":
              value = true
              break
          }
        } else {
          console.log("cannot be converted to a boolean", value)
          return
        }
      }
      _this.config[args[1]] = value;
      const fs = require('fs');
      fs.writeFileSync('rpc-config.ini', JSON.stringify(_this.config).replace(/((?<="))?,(?=")/gm, ',\n'));
      console.log(_this.config);
    } else {
      console.log(_this.config[args[0]]);
    }
  }
}