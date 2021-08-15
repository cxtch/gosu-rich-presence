let getLetterGrade = (data) => {
  let hasHidden = data.menu.mods.str.match(/HD/g);
  let letter = data.gameplay.hits.grade.current;
  if (letter === 'SS' && hasHidden)
    return 'xh'
  if (letter === 'S' && hasHidden)
    return 'sh'
  return letter.toLowerCase()
}
let resolveObjectPath = (obj, path) => {
  let pathArray = path.split('.');
  for (let prop of pathArray) {
    obj = obj[prop]
  }
  return obj
}
let checkRound = (time) => {
  if (time - Math.floor(time) < 0.5) {
    time = Math.floor(time);
  } else {
    time = Math.floor(time) + 1;
  }
}
module.exports = {
  getLetterGrade,
  resolveObjectPath,
  checkRound
}