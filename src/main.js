const Koa = require('koa')

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

app.listen(4000, () => {
  console.log('server is running at http://localhost:4000')
})
