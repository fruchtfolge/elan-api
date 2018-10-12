const request = require('request')
const fs = require('fs')
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
    file.on('error', err => {
      reject(err)
      return file.end()
    })
    
    const download = request(options, (err, response) => {
      if (err) return reject(err)
      
      if (response.statusCode !== 200) {
        return reject('Response status was ' + response.statusCode)
      }
      response.pipe(file)
  
      file.on('finish', () => {
        file.close(resolve)
      })
    })
  
    // check for request error too
    download.on('error', function (err) {
      fs.unlink(path.join(dest,filename), err => {
        reject(err)
      })
      return reject(err)
    })
  
    file.on('error', function(err) {
      fs.unlink(path.join(dest,filename), err => {
        reject(err)
      })
      return reject(err)
    })
  })

}
