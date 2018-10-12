const unzip = require('unzip')
const fs = require('fs')
const path = require('path')

module.exports = function readUnzip(dest, filename, file) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(dest,filename))
      .pipe(unzip.Extract({ path: dest }))
      .on('close', () => {
        resolve()
      })
      .on('error', (err) => {
        fs.unlink(path.join(dest,file), err => {
          reject(err)
        })
        return reject(err)
      })
  })
    
}
