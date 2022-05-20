const Router = require('koa-router')

const {
  getArticleList,
  getArticleDetail,
  editArticle,
  createAcrticle,
} = require('../controller/article.controller')

const router = new Router()

// 文章列表接口
router.get('/article/list', getArticleList)

// 查看文章详细接口
router.get('/article/:id', getArticleDetail)

// 编辑文章接口
router.post('/article/edit', editArticle)
// 创建文章
router.post('/article/create', createAcrticle)

module.exports = router
