const fs = require('fs')

module.exports = {
  unlink(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  mkdir(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  },
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) return reject(err)
        return resolve(data)
      })
    })
  },
  rmdir(path) {
    return new Promise((resolve, reject) => {
      fs.rmdir(path, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
}
