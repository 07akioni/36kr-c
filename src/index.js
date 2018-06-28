const request = require('superagent')
const path = require('path')
const fs = require('fs')
const { saveArea } = require('./areaInfo')
const { saveLabel } = require('./getAllLabels')
const { getProjectInfo } = require('./getProjectInfo')
const { processProjectInfo } = require('./processProjectInfo')
const cookie = require('./Cookie')

async function main () {
  try {
    // await saveArea()
    await saveLabel()
  } catch (err) {
    console.log(err)
    return
  }
  try {
    await cookie.init()
    const ress = await getProjectInfo('51163101')
    const projectData = processProjectInfo(ress)
    console.log(projectData)
  } catch (err) {
    console.log(err)
  }
}

main()