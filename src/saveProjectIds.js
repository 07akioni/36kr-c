const { getAllLabels } = require('./getAllLabels')
const { requestGet } = require('./utils')
const { areas, phases } = require('./config')
const path = require('path') 
const fs = require('fs')
const cookie = require('./Cookie')

const labels = getAllLabels();

async function sleep (ms) {
  await new Promise((res, rej) => {
    setTimeout(() => res(), ms)
  })
}

async function saveProjectIds () {
  const projectFileNames = fs.readdirSync(path.resolve(__dirname, '../data/projectId'))
  const projectFileNameSet = new Set(projectFileNames)
  for (let label of labels) {
    const labelNamePrefix = `${label.industryName}|${label.industry}|${label.id}`
    const doneFileName = labelNamePrefix + '|done.json'
    if (projectFileNameSet.has(doneFileName) || projectFileNameSet.has(labelNamePrefix + '|p50.json') ) continue
    for (let i = 1; i <= 50; ++i) {
      const fileName = `${labelNamePrefix}|p${i}.json`
      if (projectFileNameSet.has(fileName)) continue
      let maxRetryCount = 3
      console.log(`下载${fileName}信息`)
      while (true) {
        try {
          res = await requestGet('rong.36kr.com', '/n/api/column/0/company').query({
            industry: label.industry,
            label: label.id,
            p: i
          })
          if (res.body.code === 429) {
            console.log('爬虫爬太快了')
            console.log('我们换一个账号吧')
            await cookie.setInvalid()
            await cookie.refreshCookie()
            continue 
          }
          const pageData = res.body.data.pageData
          if (pageData.data.length < 20) {
            fs.writeFileSync(path.resolve(__dirname, '../data/projectId', doneFileName), { "totalPages": null, "pageSize": null, "page": null, "data":[] })
            break
          } else {
            fs.writeFileSync(path.resolve(__dirname, '../data/projectId', fileName), JSON.stringify(pageData))
          }
          await sleep(2000)
        } catch (err) {
          console.log(err)
          console.log(`${fileName} 获取出错，再试一次`)
          maxRetryCount--
          if (maxRetryCount <= 0) {
            console.log(`${fileName} 出错太多次了，放弃`)
            break
          }
          continue
        }
        break
      }
      sleep(5000)
    }
  }
}

/*
 * 这个函数写的很差，根本没有解耦合...
 */
async function saveProjectIdsByAreaAndPhase () {
  await cookie.init()
  const projectFileNames = fs.readdirSync(path.resolve(__dirname, '../data/projectIdByAreaAndPhase'))
  const projectFileNameSet = new Set(projectFileNames)
  const industrys = getIndustrys()
  let cnt = 0
  let exchangeCookieCount = 0
  for (let industry of industrys) {
    for (let area of areas) {
      getPageInArea: for (let phase of phases) {
        const fileNamePrefix = `${industry[0]}|${industry[1]}|${area.name}|${area.id}|${phase}`
        const doneFileUnlimitedName = `${industry[0]}|${industry[1]}|${area.name}|${area.id}|unlimited|done.json`
        const doneFileName = fileNamePrefix + '|done.json'
        if (projectFileNameSet.has(doneFileName) || projectFileNameSet.has(doneFileUnlimitedName) || projectFileNameSet.has(fileNamePrefix + '|p50.json')) continue
        getPage: for (let i = 1; i <= 50; ++i) {
          const fileName = `${fileNamePrefix}|p${i}.json`
          if (projectFileNameSet.has(fileName)) continue
          let maxRetryCount = 3
          cnt++
          console.log(`下载 ${fileName} 信息(${cnt})`)
          while (true) {
            try {
              await sleep(2000)
              res = await Promise.race([
                requestGet('rong.36kr.com', '/n/api/column/0/company').query({
                  industry: industry[1],
                  city: area.id,
                  phase: phase,
                  p: i
                }),
                new Promise((res, rej) => {
                  setTimeout(() => rej(new Error('请求超时了！！！')), 100000)
                })
              ])
              /*
               * 干脆每爬一次换个账号吧
               * 200秒一轮 18000秒 五个小时轮一波
               */
              exchangeCookieCount++
              if (exchangeCookieCount >= 10) {
                exchangeCookieCount = 0
                console.log('刷新cookie')
                await cookie.refreshCookie()
              }
              
              if (res.body.code === 429) {
                console.log('爬虫爬太快了')
                console.log('我们换一个账号吧')
                await cookie.setInvalid()
                await cookie.refreshCookie()
                continue 
              }
              const pageData = res.body.data.pageData
              if (pageData.data.length < 20) {
                fs.writeFileSync(path.resolve(__dirname, '../data/projectIdByAreaAndPhase', fileName), JSON.stringify(pageData))
                fs.writeFileSync(path.resolve(__dirname, '../data/projectIdByAreaAndPhase', doneFileName), JSON.stringify({ "totalPages": null, "pageSize": null, "page": null, "data":[] }))
                if (phase === 'unlimited') {
                  break getPageInArea
                }
                break getPage
              } else {
                fs.writeFileSync(path.resolve(__dirname, '../data/projectIdByAreaAndPhase', fileName), JSON.stringify(pageData))
              }
            } catch (err) {
              console.log(err)
              console.log(`${fileName} 获取出错，再试一次`)
              maxRetryCount--
              if (maxRetryCount <= 0) {
                console.log(`${fileName} 出错太多次了，放弃`)
                break
              }
              continue
            }
            break
          }
        }
      }
    }
  }
}

function getIndustrys () {
  let industryNames = fs.readdirSync(path.resolve(__dirname, '../data/label'))
  let industrys = industryNames.filter(v => v !== '.DS_Store').map(v => v.split('|').slice(0, 2))
  return industrys
}

saveProjectIdsByAreaAndPhase()

// console.log(readLabelsInfo())

/*
 * for (let i = 1; i <= 10; ++i) { // 一次打包五个请求吧
      if (projectFileNameSet.has(`${labelNamePrefix}|p${i * 5}.json`)) continue
      let maxRetryCount = 3
      console.log(`下载${labelNamePrefix}|p${i * 5 - 4}~p${i * 5}.json信息`)
      while (true) {
        try {
          const ress = await Promise.all([
            requestGet('rong.36kr.com', '/n/api/column/0/company').query({
              industry: label.industry,
              label: label.id,
              p: (i - 1) * 5 + 1
            }),
            requestGet('rong.36kr.com', '/n/api/column/0/company').query({
              industry: label.industry,
              label: label.id,
              p: (i - 1) * 5 + 2
            }),
            requestGet('rong.36kr.com', '/n/api/column/0/company').query({
              industry: label.industry,
              label: label.id,
              p: (i - 1) * 5 + 3
            }),
            requestGet('rong.36kr.com', '/n/api/column/0/company').query({
              industry: label.industry,
              label: label.id,
              p: (i - 1) * 5 + 4
            }),
            requestGet('rong.36kr.com', '/n/api/column/0/company').query({
              industry: label.industry,
              label: label.id,
              p: (i - 1) * 5 + 5
            })
          ])
          for (let res of ress) {
            if (res.body.code === 429) {
              console.log('爬虫爬太快了，还没缓过来')
              process.exit(0)
            }
            const pageData = res.body.data.pageData
            
            if (pageData.data.length == 0) {
              fs.writeFileSync(path.resolve(__dirname, '../data/projectId', doneFileName), { "totalPages": null, "pageSize": null, "page": null, "data":[] })
              break
            } else {
              fs.writeFileSync(path.resolve(__dirname, '../data/projectId', `${labelNamePrefix}|p${pageData.page}`), pageData)
            }
          }
        } catch (err) {
          console.log(err)
          console.log(`${labelNamePrefix}|p${i * 5 - 4}~p${i * 5}.json 获取出错，再试一次`)
          maxRetryCount--
          if (maxRetryCount <= 0) {
            console.log(`${labelNamePrefix}|p${i * 5 - 4}~p${i * 5}.json 出错太多次了，放弃`)
            break
          }
          continue
        }
        break
      }
      sleep(5000)
    }
 */