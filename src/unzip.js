const unzip = require('unzip')
const fs = require('fs')
const utils = require('./utils')
const path = require('path')

module.exports = function readUnzip(dest, filename) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(dest,filename))
      .pipe(unzip.Extract({ path: dest }))
      .on('close', () => {
        resolve()
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
