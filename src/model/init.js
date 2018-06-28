const { User } = require('./model')

User.sync().then(() => {
  console.log('同步完毕')
})