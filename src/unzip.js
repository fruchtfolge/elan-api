const yauzl = require('yauzl')

module.exports = function unzip(zip) {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(zip,{lazyEntries: true}, (err, content) => {
      if (err) return reject(err)
      content.readEntry()
      content.on('entry', entry => {
        content.openReadStream(entry, (err, readStream) => {
          if (err) return reject(err)
          let res = []
          readStream.on('end', () => {
            return resolve(res.join(''))
          })
          readStream.on('data', (chunk) => {
            res.push(chunk.toString())
          })
          readStream.on('err', (e) => {
            return reject(e)
          })
        })
      })
    })
  })    
}
