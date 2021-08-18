module.exports = {
  description: "Copy the current beatmap to the clipboard",
  run(_this) {
    const clipboardy = require('clipboardy');
    let beatmap = `https://osu.ppy.sh/b/${_this.cache.menu.bm.id}`
    try {
      clipboardy.writeSync(beatmap)
      console.log('beatmap copied to clipboard', beatmap)
    } catch (err) {
      console.log(beatmap)
    }
  }
}