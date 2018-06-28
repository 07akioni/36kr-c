const request = require('superagent')
const { setNewSubEmailAddress } = require('./pkuIaaaLogin')
const { getNewUserProfile }  = require('./getNewUserProfile')
const { getActiveCode, getLatestEmailBody, getLoginCookie, activeNewAccount, getLatestEmailTo } = require('./receiveEmail')
const { User } = require('../model/model')

async function sleep (ms) {
  await new Promise((res, rej) => {
    setTimeout(() => res(), ms)
  })
}

async function crackCaptcha (captcha) {
  const res = await request
    .get('http://jiyanapi.c2567.com/shibie')
    .query({
      challenge: captcha.challenge,
      gt: captcha.gt,
      referer: 'passport.36kr.com',
      user: 'kirby5',
      pass: 'kirby5',
      return: 'json',
      model: '2',
      format: 'utf8'
    })
  return JSON.parse(res.text)
}

async function sendRegisterReq (captchaRes, userProfile) {
  try {
    const res = await request
      .post('https://passport.36kr.com/passport/send_code/mail')
      .type('form')
      .set({
        Origin: 'https://passport.36kr.com',
        Referer: 'https://passport.36kr.com'
      })
      .send({
        account: userProfile.email,
        voice: 'false',
        geetest_challenge: captchaRes.challenge,
        geetest_validate: captchaRes.validate,
        geetest_seccode: `${captchaRes.validate}|jordan`
      })
    // console.log(res.text)
  } catch (err) {
    console.log(err)
  }
}

async function register36kr () {
  let maxRetry = 3, captcha
  while (true) {
    try {
      /*
       * 首先获得一个新的账户信息
       */
      console.log('获取新的账户信息')
      const userProfile = await getNewUserProfile()
      console.log(userProfile)
      /*
       * 然后修改 pku 邮箱地址
       */
      console.log('设置新的邮件地址')
      await setNewSubEmailAddress(userProfile.email)
      /*
       * 然后获取验证码
       */
      console.log('拿到验证码')
      captcha = await getCaptcha()
      // console.log(captcha)
      /*
       * 然后破解验证码
       */
      console.log('破解验证码')
      const captchaRes = await crackCaptcha(captcha)
      if (captchaRes.status !== 'ok') throw Error('验证码破解失败')
      // console.log(captchaRes)
      /*
       * 发送一个注册请求，这个时候应该会给你的邮箱发验证邮件了
       */
      console.log('发送注册请求')
      await sendRegisterReq(captchaRes, userProfile)
      console.log('等待一段时间，防止没收到邮件')
      while (true) {
        await sleep(10000)
        const emailTo = await getLatestEmailTo()
        console.log('最新邮件地址为:', emailTo)
        if (emailTo === userProfile.email) {
          console.log('收到邮件了')
          break
        }
      }
      /*
       * 接受验证邮件的话，这样应该会拿到验证码了
       */
      console.log('接受验证邮件, 拿到激活码')
      const activeCode = getActiveCode(await getLatestEmailBody())
      console.log('激活码:', activeCode)
      console.log('激活新账户')
      await activeNewAccount(userProfile, activeCode)
      console.log('把新用户写进数据库')
      await User.create({
        ...userProfile,
        valid: true
      })
      const sizeOfUser = await User.count()
      console.log(`有 ${sizeOfUser} 个用户`)
    } catch (err) {
      console.log('流程出错')
      maxRetry--
      if (maxRetry === 0) {
        console.log(err)
        throw Error('流程出错太多次了！放弃')
      }
      continue
    }
    break
  }
  // console.log(captcha)
}

async function getCaptcha () {
  const res = await request.get('https://passport.36kr.com/captcha/v2')
  const captcha = res.body
  return captcha
}


module.exports = {
  register36kr
}
