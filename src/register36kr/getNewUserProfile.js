const crypto = require('crypto')

async function randomBytes () {
  return await new Promise(res => crypto.randomBytes(3, function(ex, buf) {  
    res(buf.toString('hex'))
  }))
}

async function getNewUserProfile () {
  return {
    email: `k${await randomBytes()}@pku.edu.cn`,
    password: '666777'
  }
}

module.exports = {
  getNewUserProfile
}