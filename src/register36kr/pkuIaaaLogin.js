const request = require('superagent')
const cheerio = require('cheerio')

function getUsernameFromEmail (email) {
  return email.split('@')[0]
}

async function setNewSubEmailAddress (newEmailAddress) {
  try {
    const agent = request.agent()
    let res = await agent
      .get('https://its.pku.edu.cn')
    res = await agent
      .post('https://its.pku.edu.cn/cas/webLogin')
      .type('form')
      .send({
        iprange: 'yes',
        username: '1400012729',
        password: 'cycynyzl1A'
      })
    res = await agent
      .get('https://its.pku.edu.cn/netportal/')
    res = await agent
      .get('https://its.pku.edu.cn/netportal/myits.jsp')
    res = await agent
      .get('https://its.pku.edu.cn/netportal/itsUtil?operation=mail')
    let $ = cheerio.load(res.text)
    const postData = {}
    $('input[type=hidden]').each(function () {
      postData[$(this).attr('name')] = $(this).val()
    })
    res = await agent
      .post('https://its.pku.edu.cn/netportal/itsUtil')
      .type('form')
      .set({
        referer: 'https://its.pku.edu.cn/netportal/itsUtil?operation=mail'
      })
      .send({
        ...postData,
        mail_tmp: getUsernameFromEmail(postData.old_mail),
        mailalternateaddress1_tmp: getUsernameFromEmail(postData.old_mailalternateaddress1),
        mailalternateaddress2_tmp: getUsernameFromEmail(newEmailAddress),
        mailforwardingaddress: '',
        isWebOnly: 'no',
        operation: 'saveMailalternateaddress2',
      })
    $ = cheerio.load(res.text)
    // console.log(res.text)
    if (!/设置成功/.test($('tr>td>font>b').text())) {
      throw new Error('新的 email 设置失败')
    }
    return newEmailAddress
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  setNewSubEmailAddress
}