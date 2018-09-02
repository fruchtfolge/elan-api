const elanGet = require('../index.js')
const fs = require('fs')
const credentials = JSON.parse(fs.readFileSync('spec/credentials.json', 'utf-8'))

describe('Get ELAN XML', () => {

  it('returns XML', () => {
    elanGet(credentials.farmno, credentials.pass, {
      type: 'Verzeichnis',
      year: '2018'
    })
    .then(res => {
      expect(typeof(res)).toBe('string')
      done()
    })
    .catch(err => {
      console.log(err)
    })
  })

  it('fails due to missing credentials', () => {
    elanGet(undefined, credentials.pass, {
      type: 'Verzeichnis',
      year: '2018'
    })
    .then(res => {
      //
    })
    .catch(err => {
      expect(err).toBe('No credentials provided')
    })
  })

  it('fails due to wrog credentials', () => {
    elanGet(credentials.farmno, 'wrongPassword', {
      type: 'Verzeichnis',
      year: '2018'
    })
    .then(res => {
      //
    })
    .catch(err => {
      expect(err).toBe('No credentials provided')
    })
  })
  
})
