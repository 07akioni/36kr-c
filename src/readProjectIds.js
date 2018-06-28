const fs = require('fs')
const path = require('path')

const projectIdFiles = fs.readdirSync('../data/projectIdByAreaAndPhase')

const projectIds = new Set()
for (let projectIdFile of projectIdFiles) {
  if (projectIdFile === '.DS_Store') continue
  const projectIdJson = require(path.resolve(__dirname, '../data/projectIdByAreaAndPhase', projectIdFile))
  for (let project of projectIdJson.data) {
    projectIds.add(project.id)
  }
}
const projectIdArray = Array.from(projectIds)
console.log(projectIdArray.length)

fs.writeFileSync('projectIds.json', JSON.stringify(projectIdArray))
