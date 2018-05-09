/*
 * 处理 getProjectInfo resolve 的数据
 */
function processProjectInfo ([basicInfo, memberInfo, newsInfo, similarInfo, fundsInfo]) {
  return {
    basic: processBasicInfo(basicInfo),
    member: processMemberInfo(memberInfo),
    news: processNewsInfo(newsInfo),
    similar: processSimilarInfo(similarInfo),
    funds: processFundsInfo(fundsInfo)
  }
}

function processBasicInfo (res) {
  const data = res.body.data
    return {
      rawData: data,
      data: {
        name: data.name,
        fullName: data.fullName,
        intro: data.intro
      }
    }
}

function processSimilarInfo (res) {
  const data = res.body.data
  return {
    rawData: data,
    data: {
      '综合': data[0].companyList.map(v => {
        return {
          name: v.name,
          industry: v.industry,
          brief: v.brief
        }
      })
    }
  }
}

function processMemberInfo (res) {
  const data = res.body.data
  return {
    rawData: data,
    data: {
      members: data.members.map(v => {
        return {
          name: v.name,
          position: v.position,
          intro: v.intro
        }
      })
    }
  }
}

function processNewsInfo (res) {
  const data = res.body.data
  return {
    rawData: data,
    data
  }
}

function processFundsInfo (res) {
  const data = res.body.data
  return {
    rawData: data,
    data
  }
}

module.exports = {
  processProjectInfo
}