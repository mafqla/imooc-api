const Router = require('koa-router')
const profile = require('./profile.route')
const userManage = require('./userManage.route')
const role = require('./role.route')
const article = require('./article.route')

const router = new Router({ prefix: '/api' })

router.use(profile.routes())
router.use(userManage.routes())
router.use(role.routes())
router.use(article.routes())

module.exports = router
