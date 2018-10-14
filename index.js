const path = require('path')
const utils = require('./src/utils')
const getCookie = require('./src/cookie')
const download = require('./src/download')
const readUnzip = require('./src/unzip')

function getLatestElanYear() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()

  // The Elan Download portal is generally updated on the 1st of September
  if (month >= 8) return year.toString()
  else return (year-1).toString()
}

module.exports = async function getInvekos(farmno, pass, options) {
  if (!farmno || !pass) throw new Error('No credentials provided')
  options = options || {}
  options.year = options.year || getLatestElanYear()
  options.type = options.type ||'Verzeichnis'

  let file = 'Flächenverzeichnis.xml'
  if (options.type == 'Geometrien') {
    file = 'Teilschlaggeometrien.gml'
  }

  const filename = `${options.type}_${farmno}_${options.year}.zip`
  const rand = Math.random().toString(36).substring(7)

  try {
    // create temp folder
    await utils.mkdir(rand)
    // login into ELAN Download Portal and save cookie
    const cookie = await getCookie(farmno, pass)
    // download file into folder
    await download(cookie, rand, filename)
    // read .zip file and unzip
    await readUnzip(rand, filename)
    // read extracted file
    const results = await utils.readFile(path.join(rand, file))
    // delete .xml / .gml / .zip file
    await utils.unlink(path.join(rand, file))
    await utils.unlink(path.join(rand, filename))
    await utils.rmdir(rand)

    return results
  } catch (e) {
    throw new Error(e)
  }
}
