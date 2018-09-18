const fs = require('fs-extra')
const osmosis = require('osmosis')
const request = require('request')
const unzip = require('unzip')

function getLatestElanYear() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()

  // The Elan Download portal is generally updated on the 1st of September
  if (month >= 8) return year.toString()
  else return (year-1).toString()
}

function getInvekos(farmno, pass, options) {
  return new Promise((resolve, reject) => {
    if (!farmno || !pass) return reject('No credentials provided')
    else if (!options && options.year) {
      options = options || {}
      options.year = getLatestElanYear()
    }
    osmosis
    .get('https://www.lwk-verfahren.de/DownloadPortal/pages/index.action')
  	.post('https://www.lwk-verfahren.de/DownloadPortal/pages/j_security_check', {'j_username': '276' + farmno, 'j_password': pass, 'submitButton': 'Login'})
  	.then((context) => {
      const filename = `${options.type}_${farmno}_${options.year}.zip`
  		const download = {
  		  url: `https://www.lwk-verfahren.de/DownloadPortal/pages/loadFile.action?filename=${filename}`,
  		  headers: {
  		    'cookie': context.request.headers['cookie']
  		  }
  		}
  		const stream = request(download).pipe(fs.createWriteStream(filename))
      const rand = Math.random().toString(36).substring(7)
      
  		stream.on('finish', () => {
        fs.mkdir(rand)
        .then(() => {
          let result
          fs.createReadStream(filename)
          .pipe(unzip.Extract({ path: rand }))
          .on('close', () => {
            let file = 'Flächenverzeichnis.xml'
    				if (options.type == 'Geometrien') {
    					file = 'Teilschlaggeometrien.gml'
    				}

            fs.readFile(rand + '/' + file, 'utf-8')
            .then(content => { result = content })
            .then(fs.unlink(rand + '/' + file))
            .then(fs.rmdir(rand))
            .then(fs.unlink(filename))
            .then(() => { return resolve(result) })
            .catch(err => { return reject(err) })
    			})
          .on('error', (err) => {
            fs.unlink(rand + '/' + file)
            .then(fs.rmdir(rand))
            .then(fs.unlink(filename))
            .then(() => resolve(err))
            .catch(() => resolve(err))
          })
        })
  		})

      stream.on('error',err => { return reject(err) })

  	})
  	.error(err => { return reject(err) })
  })
}

module.exports = getInvekos
