const { requestGet } = require('./utils')
const path = require('path')
const fs = require('fs')
const { industrys } = require('./config')

/*
 * 将信息保存在 data/label.json 中
 */
async function saveLabel () {
  for (let industry of industrys) {
    let retryCount = 5
    while (retryCount--) {
      try {
        const labelFilePath = path.resolve(__dirname, `../data/label/${industry.name}|${industry.tag}|label.json`)
        if (fs.existsSync(labelFilePath)) break
        console.log('下载 ' + industry.name + ' 信息')
        const res = await requestGet('rong.36kr.com', '/n/api/column/0/company?sortField=HOT_SCORE&p=1').query({
          'industry': industry.tag
        })
        fs.writeFileSync(labelFilePath, JSON.stringify(res.body.data.label))
      } catch (err) {
        if (retryCount <= 0) {
          console.log('出错太多了！')
          continue
        }
        console.log('出错了，重试一次')
        console.log(err)
      }
      break
    }
  }
}

function readLabelsInfo () {
  let labels = fs.readdirSync(path.resolve(__dirname, '../data/label'))
  labels = labels.filter(v => v !== '.DS_Store')
  const labelPaths = labels.map(v => {
    return [v.split('|')[0], v.split('|')[1], path.resolve(__dirname, '../data/label', v)]
  })
  return labelPaths.map(v => [v[0], v[1], readLabelInfo(v[2])])
}

/*
 * 从 data/label.json 中读取地区信息
 */
function readLabelInfo (labelFilePath) {
  const labelInfo = require(labelFilePath)
  return labelInfo
}

function flattenLabelInfo (labelInfos) {
  const types = []
  for (let info of labelInfos) {
    for (let item of info[2]) {
      types.push({
        industry: info[1],
        industryName: info[0],
        name: item.name,
        id: item.id,
        cnt: item.cnt
      })
    }
  }
  return types
}

function getAllLabels () {
  return flattenLabelInfo(readLabelsInfo())
}

module.exports = { saveLabel, getAllLabels, readLabelsInfo }