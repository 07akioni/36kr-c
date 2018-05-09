/*
 * 将信息保存在 data/area.json 中
 */
async function saveArea () {
  const areaFilePath = path.resolve(__dirname, '../data/area.json')
  if (fs.existsSync(areaFilePath)) return
  try {
    const res = await requestGet('rong.36kr.com', '/n/api/dict/area').query({
      parentId: 0
    })
    fs.writeFileSync(areaFilePath, JSON.stringify(res.body))
  } catch (err) {
    console.log(err)
  }
}

/*
 * 从 data/area.json 中读取地区信息
 */
function readAreaInfo () {
  const areaFilePath = path.resolve(__dirname, '../data/area.json')
  const areaInfo = require(areaFilePath)
  return areaInfo.data.data
}
