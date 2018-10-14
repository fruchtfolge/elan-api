const osmosis = require('osmosis')

module.exports = function getCookie (farmno, pass) {
  return new Promise ((resolve, reject) => {
    osmosis
      .get('https://www.lwk-verfahren.de/DownloadPortal/pages/index.action')
      .post('https://www.lwk-verfahren.de/DownloadPortal/pages/j_security_check', {'j_username': '276' + farmno, 'j_password': pass, 'submitButton': 'Login'})
      .then(context => {
        return resolve(context.request.headers['cookie'])
      })
      .error(err => {
        reject(err)
      })
  })
}
