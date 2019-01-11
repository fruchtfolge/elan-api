const request = require('request')

module.exports = function download(cookie,filename) {
  return new Promise((resolve, reject) => {

    const options = {
      url: `https://www.lwk-verfahren.de/DownloadPortal/pages/loadFile.action?filename=${filename}`,
      headers: {
        'cookie': cookie
      },
      encoding: null
    }

    request.get(options, (e,r,b) => {
      if (e) return reject(b)
      resolve(b)
    })
  })
}
