const Router = require('koa-router')

const { getArticleList } = require('../controller/article.controller')

const router = new Router()

// 文章列表接口
router.get('/article/list', getArticleList)

module.exports = router
