const { Article } = require('../model/index')

// 文章列表
const getArticleList = async (ctx) => {
  let page = parseInt(ctx.query.page)
  let size = parseInt(ctx.query.size)
  const total = await Article.find().count()
  const listResult = await Article.find()
    .limit(size)
    .skip((page - 1) * size)

  // console.log(listResult)
  const list = []
  for (let i in listResult) {
    list.push({
      _id: listResult[i]._id,
      ranking: listResult[i].ranking,
      title: listResult[i].title,
      author: listResult[i].author,
      publicDate: listResult[i].publicDate,
      desc: listResult[i].desc,
      content: listResult[i].content,
    })
  }

  ctx.body = {
    success: true,
    code: 200,
    data: {
      list: list,
      total,
      page,
      size,
    },
  }
}

// 查看文章详细
const getArticleDetail = async (ctx) => {
  const id = ctx.query.id
  const article = await Article.findOne(id)
  ctx.body = {
    success: true,
    code: 200,
    data: article,
  }
}

module.exports = {
  getArticleList,
  getArticleDetail,
}
