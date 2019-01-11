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

  const filename = `${options.type}_${farmno}_${options.year}.zip`

  try {
    // login into ELAN Download Portal and save cookie
    const cookie = await getCookie(farmno, pass)
    // download zip file and unzip in buffer
    const zip = await download(cookie, filename)
    const unzipped = await readUnzip(zip)
    // return unzipped file
    return unzipped
  } catch (e) {
    throw new Error(e)
  }
}
