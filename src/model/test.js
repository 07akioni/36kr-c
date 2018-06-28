const { User } = require('./model')

async function test () {
  const userProfile = {
    email: '2313',
    password: '231231'
  }
  await User.create({
    ...userProfile,
    valid: false
  })
  console.log('数量', await User.count())
  await User.destroy({
    where: {
      email: '2313'
    }
  })
}

test()