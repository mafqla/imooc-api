const Router = require('koa-router')

const {
  getArticleList,
  getArticleDetail,
} = require('../controller/article.controller')

const router = new Router()

// 文章列表接口
router.get('/article/list', getArticleList)

// 查看文章详细接口
router.get('/article/:id', getArticleDetail)
module.exports = router
