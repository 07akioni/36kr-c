const { register36kr } = require('./register36kr/register36kr')

async function main () {
  while (true) {
    try {
      await register36kr()
    } catch (err) {
      console.log(err)
    }
  }
}

main()