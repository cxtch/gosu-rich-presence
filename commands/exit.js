module.exports = {
  description: "Close gosu-rich-presence",
  run() {
    process.emit('beforeExit')
  }
}