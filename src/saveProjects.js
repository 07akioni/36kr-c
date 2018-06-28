const { getProjectInfo } = require('./getProjectInfo')
const { processProjectInfo } = require('./processProjectInfo')
const cookie = require('./Cookie')
const fs = require('fs')
const path = require('path')

function getProjectIds () {
  return require('./projectIds.json')
}

function getDownloadedProjectIds () {
  let projectArray = fs.readdirSync(path.resolve(__dirname, '../data/project'))
  projectArray = projectArray.filter(v => v[0] !== '.').map(v => v.split('|')[0])
  return new Set(projectArray)
}

async function saveProjects (projectIds) {
  while (true) {
  try {
    await cookie.init()
  } catch (err) {
    if (err.response.body.forbidSource === 'anticrawler') {
      await cookie.setInvalid()
    }
    console.log(err.response.body)
    console.log('这个账号失效了')
    continue
  }
    break
  }
  const downloadedProjectIds = getDownloadedProjectIds()
  console.log(projectIds.length)
  console.log(downloadedProjectIds.size)
  const refreshCookieEvery = 5
  let count = 0
  let requestCount = 0
  projectLoop: for (let projectId of projectIds) {
    count++
    if (downloadedProjectIds.has(String(projectId))) {
      continue
    } else {
      let maxRetryCount = 5
      while (true) {
        try {
          await sleep(2000)
          const projectInfo = await Promise.race([getProjectInfo(projectId), new Promise((res, rej) => {
              setTimeout(() => rej(new Error('获取超时了')), 200000)
          })])
          requestCount++
          if (requestCount === refreshCookieEvery) {
            requestCount = 0
            await cookie.refreshCookie()
          }
          const processedProjectInfo = processProjectInfo(projectInfo)
          console.log(`保存${projectId}|${processedProjectInfo.basic.data.name}(${count})`)
          console.log(processedProjectInfo.basic.data.name.replace(/\//g, '-'))
          if (!processedProjectInfo.basic.data.name) {
              console.log('该项目被删除了，下一个')
              fs.writeFileSync(path.resolve(__dirname, `../data/project/${projectId}|被删除的项目.json`), JSON.stringify(processedProjectInfo))
              continue projectLoop
          }
          fs.writeFileSync(path.resolve(__dirname, `../data/project/${projectId}|${processedProjectInfo.basic.data.name.replace(/\//g, '-')}|v2.json`), JSON.stringify(processedProjectInfo))
        } catch (err) {
          if (err.message == 429) {
            console.log('爬太快了')
            console.log('换一个cookie')
            await cookie.setInvalid()
            await cookie.refreshCookie()
            continue
          }
          maxRetryCount--
          if (maxRetryCount === 0) {
            await cookie.refreshCookie()
            console.log(`出错次数太多，不重试了`)
            continue
          }
          console.log(`保存 ${projectId} 出错了，重试`)
          console.log(err)
        }
        break
      }
    }
  }
}

async function sleep (ms) {
  await new Promise((res, rej) => {
    setTimeout(() => res(), ms)
  })
}

saveProjects(getProjectIds())
