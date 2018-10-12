const elanGet = require('../index.js')
const fs = require('fs')
const assert = require('assert')
const credentials = JSON.parse(fs.readFileSync('test/credentials.json', 'utf-8'))
const verzeichnis = fs.readFileSync('test/verzeichnis.xml', 'utf-8')
const geometries = fs.readFileSync('test/geometries.gml', 'utf-8')

/*
elanGet(credentials.farmno, credentials.pass, {
  type: 'Verzeichnis',
  year: '2018'
})
.then(res => {
  assert.deepStrictEqual(res,verzeichnis)
})
.catch(err => {
  console.log(err)
})

elanGet(credentials.farmno, credentials.pass, {
  type: 'Geometrien',
  year: '2018'
})
.then(res => {
  assert.deepStrictEqual(res,geometries)
})
.catch(err => {
  console.log(err)
})
*/
elanGet(credentials.farmno, credentials.pass, {
  type: 'Verzeichnis',
  year: '2018'
})
.then(res => {
  console.log(res)
})
.catch(err => {
  console.log(err)
})
