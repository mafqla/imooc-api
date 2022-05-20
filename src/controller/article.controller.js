const { Article } = require('../model/index')
const mongoose = require('mongoose')

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
  const { id } = ctx.params
  const OId = mongoose.Types.ObjectId(id)
  const article = await Article.findOne({ _id: OId })
  ctx.body = {
    success: true,
    code: 200,
    data: article,
    message: '获取文章详细成功！',
  }
}

// 编辑文章
const editArticle = async (ctx) => {
  const { id, title, content } = ctx.request.body
  const OId = mongoose.Types.ObjectId(id)
  let date = new Date()
  const publicDate = date.getTime()
  await Article.updateOne(
    {
      _id: OId,
    },
    {
      $set: {
        title: title,
        content: content,
        publicDate: publicDate,
      },
    },
    {
      new: true,
    },
  )
    .then((result) => {
      ctx.body = {
        success: true,
        code: 200,
        data: result.upsertedId,
        message: '编辑文章成功！',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        data: err,
        message: '编辑文章失败！',
      }
    })
}

// 创建文章
const createAcrticle = async (ctx) => {
  const { title, content } = ctx.request.body
  const author = ctx.state.user.username
  let date = new Date()
  const publicDate = date.getTime()
  const ranking = (await Article.find().count()) + 1
  const desc = content.replace(/<\/?.+?>/g, '').replace(/ /g, '')
  await Article.create({ title, ranking, author, publicDate, desc, content })
    .then((result) => {
      ctx.body = {
        success: true,
        code: 200,
        data: result.id,
        message: '创建文章成功！',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        data: err,
        message: '创建文章失败！',
      }
      console.log(err)
    })
}
module.exports = {
  getArticleList,
  getArticleDetail,
  editArticle,
  createAcrticle,
}
