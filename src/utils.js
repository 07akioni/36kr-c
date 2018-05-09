const request = require('superagent')
const { Cookie } = require('./config')

function requestGet (host, path) {
  return request
    .get(`${host}${path}`)
    .set({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      Cookie
    })
}

module.exports = {
  requestGet
}
