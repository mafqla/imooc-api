const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaJwt = require('koa-jwt')

// 导入路由
const indexRouter = require('../router/index')
// 连接数据库
const MongoConnect = require('../db')

MongoConnect()

const app = new Koa()
app.use(KoaBody())

app.use(
  KoaJwt({ secret: 'imooc-api' }).unless({
    path: [/\/sys\/login/, /\/sys\/register/],
  }),
)

app.use(indexRouter.routes())

module.exports = app
