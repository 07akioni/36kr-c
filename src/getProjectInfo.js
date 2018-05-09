const { requestGet } = require('./utils')

function getProjectInfo (projectId) {
  return Promise.all([
    getProjectBasicInfo(projectId),
    getProjectMemberInfo(projectId),
    // 需要认证投资人 缺少项目数据
    getProjectNewsInfo(projectId),
    getProjectSimilarInfo(projectId),
    getProjectFundsInfo(projectId)
  ])
}

/*
 * 基础信息
 */
function getProjectBasicInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}`)
}

/*
 * 相似项目
 */
async function getProjectSimilarInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/similar`)
}

/*
 * 创始团队
 */
async function getProjectMemberInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/member`)
}

/*
 * 相关新闻
 */
async function getProjectNewsInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/news`)
}

/*
 * 相关融资信息
 */
async function getProjectFundsInfo (projectId, maxRetryTimes = 5) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/funds`)  
}

module.exports = {
  getProjectInfo
}