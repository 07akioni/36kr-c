const request = require('superagent')

async function getLatestEmailAttr() {
  return await new Promise((res, rej) => {
    var Imap = require('imap'),
      inspect = require('util').inspect;

    var imap = new Imap({
      user: 'hrsonion@163.com',
      password: '666777Aa',
      host: 'imap.163.com',
      port: 993,
      tls: true
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;
        /*
         * 拿到最新的邮件
         */
        var f = imap.seq.fetch(box.messages.total + ':' + box.messages.total, { bodies: ['HEADER.FIELDS (FROM, TO)', 'TEXT'] });
        f.on('message', function (msg, seqno) {
          // console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            if (info.which === 'TEXT');
            // console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
            var buffer = '', count = 0;
            stream.on('data', function (chunk) {
              count += chunk.length;
              buffer += chunk.toString();
              if (info.which === 'TEXT');
              // console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            });
            stream.once('end', function () {
              if (info.which !== 'TEXT') {
                res(Imap.parseHeader(buffer))
              }
              else {
                // console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                // console.log(buffer)
                // res(buffer)
              }
            });
          });
          msg.once('attributes', function (attrs) {
            // 
          });
          msg.once('end', function () {
            // console.log(prefix + 'Finished');
          });
        });
        f.once('error', function (err) {
          rej(Error('Fetch error: ' + err));
        });
        f.once('end', function () {
          // console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });

    imap.once('error', function (err) {
      console.log(err);
    });

    imap.once('end', function () {
      // console.log('Connection ended');
    });

    imap.connect();
  })
}


async function getLatestEmailBody() {
  return await new Promise((res, rej) => {
    var Imap = require('imap'),
      inspect = require('util').inspect;

    var imap = new Imap({
      user: 'hrsonion@163.com',
      password: '666777Aa',
      host: 'imap.163.com',
      port: 993,
      tls: true
    });

    function openInbox(cb) {
      imap.openBox('INBOX', true, cb);
    }

    imap.once('ready', function () {
      openInbox(function (err, box) {
        if (err) throw err;
        /*
         * 拿到最新的邮件
         */
        var f = imap.seq.fetch(box.messages.total + ':' + box.messages.total, { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] });
        f.on('message', function (msg, seqno) {
          // console.log('Message #%d', seqno);
          var prefix = '(#' + seqno + ') ';
          msg.on('body', function (stream, info) {
            if (info.which === 'TEXT');
            // console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
            var buffer = '', count = 0;
            stream.on('data', function (chunk) {
              count += chunk.length;
              buffer += chunk.toString();
              if (info.which === 'TEXT');
              // console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
            });
            stream.once('end', function () {
              if (info.which !== 'TEXT');
              // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
              else {
                // console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                // console.log(buffer)
                res(buffer)
              }
            });
          });
          msg.once('attributes', function (attrs) {
            // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
          });
          msg.once('end', function () {
            // console.log(prefix + 'Finished');
          });
        });
        f.once('error', function (err) {
          rej(Error('Fetch error: ' + err));
        });
        f.once('end', function () {
          // console.log('Done fetching all messages!');
          imap.end();
        });
      });
    });

    imap.once('error', function (err) {
      console.log(err);
    });

    imap.once('end', function () {
      // console.log('Connection ended');
    });

    imap.connect();
  })
}

function getActiveCode (body) {
  return /: (\d{6}) <\/p>/.exec(body)[1]
}

/*
 * 激活新账户
 */
async function activeNewAccount (userProfile, activeCode) {
  console.log(JSON.stringify({
    type: 'register',
    bind: 'false',
    needCaptcha: 'false',
    username: userProfile.email,
    password: userProfile.password,
    passwordConfirm: userProfile.password,
    verifyCode: activeCode,
    ok_url: 'https%3A%2F%2Frong.36kr.com%2Flist%2Fdetail%26%3FcolumnId%3D0%26sortField%3DHOT_SCORE',
    ktm_reghost: null
  }))

  try {
    const agent = request.agent()
    await agent.get('https://passport.36kr.com/pages/?ok_url=%2F')
    // await agent.get('passport.36kr.com')
    const res = await agent
      .post('passport.36kr.com/passport/sign_in')
      .type('form')
      .set({
        origin: 'https://passport.36kr.com',
        referer: 'https://passport.36kr.com/pages/?ok_url=https%3A%2F%2Frong.36kr.com%2Flist%2Fdetail%26%3FcolumnId%3D0%26sortField%3DHOT_SCORE',
      })
      .send({
        type: 'register',
        bind: 'false',
        needCaptcha: 'false',
        username: userProfile.email,
        password: userProfile.password,
        passwordConfirm: userProfile.password,
        verifyCode: activeCode,
        ok_url: 'https%3A%2F%2Frong.36kr.com%2Flist%2Fdetail%26%3FcolumnId%3D0%26sortField%3DHOT_SCORE',
        ktm_reghost: null
      })
  } catch (err) {
    console.log(err)
  }
}

/*
 * 获得一个新的可用的 cookie
 */
async function getLoginCookie (userProfile) {
  const agent = request.agent()
  try {
    let res = await agent
      .post('https://passport.36kr.com/passport/sign_in')
      .type('form')
      .set({
        origin: 'https://passport.36kr.com',
        referer: 'https://passport.36kr.com/pages/?ok_url=https%3A%2F%2Frong.36kr.com%2Flist%2Fdetail%26%3FcolumnId%3D0%26sortField%3DHOT_SCORE',
      })
      .send({
        type: 'login',
        bind: 'false',
        needCaptcha: 'false',
        username: userProfile.email,
        password: userProfile.password,
        ok_url: 'https%3A%2F%2Frong.36kr.com%2Flist%2Fdetail%26%3Fcity%3D101%2C109%26phase%3Dunlimited%26industry%3DE_COMMERCE%26label%3Dunlimited%26columnId%3D0%26sortField%3DHOT_SCORE',
        ktm_reghost: null
      })
    let cookie = res.header['set-cookie'].map(v => v.split(';')[0]).join('; ').trim() + ';'
    
    res = await request
      .get('https://rong.36kr.com/api/user/identity')
      .set('Cookie', cookie)

    cookie = cookie + ' ' + res.header['set-cookie'].map(v => v.split(';')[0]).join('; ').trim() + ';'

    const tres = await request
      .get('rong.36kr.com/n/api/column/0/company')
      .set({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        'Cookie': cookie
      }).query({
        industry: 'VR_AR'
      })
    // console.log(tres.text)
    return cookie
  } catch (err) {
    throw err
  }
}

async function getLatestEmailTo () {
  const res = await getLatestEmailAttr()
  return res.to[0].split(' ')[0] + '@pku.edu.cn'
}

async function main () {
  console.log(await getLatestEmailTo())
}

module.exports = {
  activeNewAccount,
  getLoginCookie,
  getLatestEmailBody,
  getActiveCode,
  getLatestEmailTo
}


// activeNewAccount()
// main()
