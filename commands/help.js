module.exports = {
  description: "Displays all the available commands",
  run(_this) {
    for (let i = 0, keys = Array.from(_this.commands.keys()); i < keys.length; i++) {
      console.log(`${keys[i]}:`, _this.commands.get(keys[i]).description)
    }
  }
}