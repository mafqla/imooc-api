const Router = require('koa-router')

const { register, login, profile } = require('../controller/user.controller')

const router = new Router({ prefix: '/api/sys' })

// 注册接口
router.post('/register', register)

// 登录接口
router.post('/login', login)

//查询用户信息接口
router.get('/profile', profile)

module.exports = router
