const request = require('request')
const fs = require('fs')
const utils = require('./utils')
const path = require('path')

module.exports = function download(cookie, dest, filename) {
  return new Promise((resolve, reject) => {

    const options = {
      url: `https://www.lwk-verfahren.de/DownloadPortal/pages/loadFile.action?filename=${filename}`,
      headers: {
        'cookie': cookie
      }
    }

    const file = fs.createWriteStream(path.join(dest,filename))
      .on('error', err => {
        file.end()
        fs.unlink(path.join(dest,filename), err => {
          reject(err)
        })
        return reject(err)
      })

    request(options)
      .pipe(file)
      .on('finish', () => {
        file.close(resolve)
      })
      .on('error', async (err) => {
        try {
          await utils.unlink(path.join(dest, filename))
          await utils.rmdir(dest)
        } catch (e) {
          reject(new Error(e))
        }
        reject(new Error(err))
      })

  })

}
