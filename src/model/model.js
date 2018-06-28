const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize('data', 'username', 'password', {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '../../data/userProfile/data.db'),
  logging: false
})

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  valid: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = {
  User
}