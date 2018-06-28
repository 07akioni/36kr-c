const { User } = require('./model/model')
const { getLoginCookie } = require('./register36kr/receiveEmail')

class Cookie {
  constructor () {
    this.cookie = null
    this.user = null
    this.isInit = false
    this.init = async () => {
      if (this.isInit) return
      this.users = await User.findAll({
        where: {
          valid: true
        }
      })
      this.user = this.users[Math.floor(Math.random()*this.users.length)]
      console.log(this.user.email)
      try {
        this.cookie = await getLoginCookie({
          email: this.user.email,
          password: this.user.password
        })
      } catch (err) {
        throw err
      }
    }
    this.setInvalid = async () => {
      await this.user.update({
        valid: false
      })
    }
    this.setValid = async () => {
      await this.user.update({
        valid: true
      })
    }
    this.refreshCookie = async () => {
      this.isInit = false
      await this.init()
    }
  }
  getCookie () {
    if (this.cookie === null) {
      throw new Error(`Cookie isn't initialized`)
    }
    return this.cookie
  }
}

module.exports = new Cookie()
