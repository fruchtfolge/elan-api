const elanGet = require('../index.js')
const fs = require('fs')
const assert = require('assert')
const credentials = JSON.parse(fs.readFileSync('test/credentials.json', 'utf-8'))
const verzeichnis = fs.readFileSync('test/verzeichnis.xml', 'utf-8')
const geometries = fs.readFileSync('test/geometries.gml', 'utf-8')

// should return 'Flaechenverzeichnis' for the latest avail. year
elanGet(credentials.farmno, credentials.pass)
  .then(res => {
    assert.deepStrictEqual(res,verzeichnis)
  })
  .catch(err => {
    throw new Error(err)
  })

// Should return 'Geometrien' for 2018
elanGet(credentials.farmno, credentials.pass, {
  type: 'Geometrien',
  year: '2018'
})
  .then(res => {
    assert.deepStrictEqual(res,geometries)
  })
  .catch(err => {
    throw new Error(err)
  })

// should throw 'no credentials' error
//assert.throws(elanGet(), 'No credentials provided')
