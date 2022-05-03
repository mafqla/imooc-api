const Koa = require('koa')
// 导入路由
const userRouter = require('../router/user.route')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
