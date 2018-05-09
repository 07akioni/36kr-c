const { requestGet } = require('./utils')
const path = require('path')
const fs = require('fs')

/*
 * 将信息保存在 data/label.json 中
 */
async function saveLabel () {
  const labelFilePath = path.resolve(__dirname, '../data/label.json')
  if (fs.existsSync(labelFilePath)) return
  try {
    const res = await requestGet('rong.36kr.com', '/n/api/column/0/company?sortField=HOT_SCORE&p=1')
    fs.writeFileSync(labelFilePath, JSON.stringify(res.body.data.label))
  } catch (err) {
    console.log(err)
  }
}

/*
 * 从 data/label.json 中读取地区信息
 */
function readLabelInfo () {
  const labelFilePath = path.resolve(__dirname, '../data/label.json')
  const labelInfo = require(labelFilePath)
  return labelInfo
}

module.exports = { saveLabel }