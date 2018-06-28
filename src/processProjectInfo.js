/*
 * 处理 getProjectInfo resolve 的数据
 */
function processProjectInfo ([basicInfo, memberInfo, newsInfo, similarInfo, fundsInfo, productInfo, financeInfo]) {
  return {
    basic: processBasicInfo(basicInfo),
    member: processMemberInfo(memberInfo),
    news: processNewsInfo(newsInfo),
    similar: processSimilarInfo(similarInfo),
    funds: processFundsInfo(fundsInfo),
    product: processProductInfo(productInfo),
    finance: processFinanceInfo(financeInfo)
  }
}

function processProductInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
  const data = res.body.data
    return {
      rawData: data,
      data: {}
    }
}

function processFinanceInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
  const data = res.body.data
    return {
      rawData: data,
      data: {}
    }
}

function processBasicInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
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
  if (res.body.code == 429) {
    throw new Error('429')
  }
  return {
    rawData: data,
    data: {
      '综合': data.length !== 0 ? data[0].companyList.map(v => {
        return {
          name: v.name,
          industry: v.industry,
          brief: v.brief
        }
      }) : []
    }
  }
}

function processMemberInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
  const data = res.body.data
  return {
    rawData: data,
    data: {
      members: data.members ? data.members.map(v => {
        return {
          name: v.name,
          position: v.position,
          intro: v.intro
        }
      }) : []
    }
  }
}

function processNewsInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
  const data = res.body.data
  return {
    rawData: data,
    data
  }
}

function processFundsInfo (res) {
  if (res.body.code == 429) {
    throw new Error('429')
  }
  const data = res.body.data
  return {
    rawData: data,
    data
  }
}

module.exports = {
  processProjectInfo
}
