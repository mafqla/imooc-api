const Koa = require('koa')
// 导入路由
const userRouter = require('../router/user.route')

// 连接数据库
const MongoConnect = require('../db')

MongoConnect()

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
