module.exports = {
  description: "Copy the current beatmap to the clipboard",
  run(_this) {
    const clipboardy = require('clipboardy');
    let beatmap;
    if (_this.cache.menu.bm.id)
      beatmap = `https://osu.ppy.sh/b/${_this.cache.menu.bm.id}`;
    else
      beatmap = `https://osu.ppy.sh/beatmapsets/${_this.cache.menu.bm.set}`;
    try {
      clipboardy.writeSync(beatmap);
      console.log('beatmap copied to clipboard', beatmap);
    } catch (err) {
      console.log(beatmap);
    }
  }
}