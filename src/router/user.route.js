const Router = require('koa-router')

const {
  register,
  login,
  verify,
  profile,
} = require('../controller/user.controller')

const router = new Router({ prefix: '/sys' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

// 登录验证
router.post('/verify', verify)

//查询用户信息接口
router.get('/profile', profile)

module.exports = router
