const request = require('superagent')
const path = require('path')
const fs = require('fs')
const { saveLabel } = require('./getAllLabels')
const { getProjectInfo } = require('./getProjectInfo')
const { processProjectInfo } = require('./processProjectInfo')

function parallelCrawl (size = 5, sleepTimeMs = 2000) {

}

async function main () {
  // await saveArea()
  // const areas = readAreaInfo()
  try {
    await saveLabel()
    const ress = await getProjectInfo('51163101')
    const projectData = processProjectInfo(ress)
    console.log(projectData)
  } catch (err) {
    console.log(err)
  }
}

main()