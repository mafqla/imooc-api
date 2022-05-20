const Router = require('koa-router')
const user = require('./user.route')
const article = require('./article.route')

const router = new Router({ prefix: '/api' })

router.use(user.routes())
router.use(article.routes())

module.exports = router
