const fs = require('fs')
const osmosis = require('osmosis')
const utils = require('./src/utils')
const getCookie = require('./src/cookie')
const download = require('./src/download')
const readUnzip = require('./src/readUnzip');
const unzip = require('unzip')

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
  options.year = options.year ||getLatestElanYear()
  options.type = options.type ||'Flächenverzeichnis'
  
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
    await readUnzip(rand, filename, file)
    // read extracted file
    const results = await utils.readFile(path.join(dest,file))
    // delete .xml / .gml / .zip file
    
  } catch (e) {
    await utils.rmdir(rand)
    throw new Error(e)
  }

  return 'fertig'
}
