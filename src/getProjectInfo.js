const { requestGet } = require('./utils')

function getProjectInfo (projectId) {
  return Promise.all([
    getProjectBasicInfo(projectId),
    getProjectMemberInfo(projectId),
    // 需要认证投资人 缺少项目数据
    getProjectNewsInfo(projectId),
    getProjectSimilarInfo(projectId),
    getProjectFundsInfo(projectId),
    getProjectProductInfo(projectId),
    getProjectFinanceInfo(projectId)
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
function getProjectSimilarInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/similar`)
}

/*
 * 创始团队
 */
function getProjectMemberInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/member`)
}

/*
 * 相关新闻
 */
function getProjectNewsInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/news`)
}

/*
 * 相关融资信息
 */
function getProjectFundsInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/funds`)  
}

/*
 * 相关融资信息
 */
function getProjectProductInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/product`)
}

/*
 * 相关金融信息
 */
function getProjectFinanceInfo (projectId) {
  return requestGet('rong.36kr.com', `/n/api/company/${projectId}/finance`)
}

module.exports = {
  getProjectInfo
}
