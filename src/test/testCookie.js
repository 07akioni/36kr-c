const cookie = require('../Cookie')

async function test () {
  await cookie.init()
  console.log(cookie.getCookie())
  await cookie.setInvalid()
  await cookie.setValid()
  await cookie.refreshCookie()
  console.log(cookie.getCookie())
}

test()