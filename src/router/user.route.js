const Router = require('koa-router')

const { register, login, profile,getPermission } = require('../controller/user.controller')

const router = new Router({ prefix: '/api' })

// 注册接口
router.post('/sys/register', register)

// 登录接口
router.post('/sys/login', login)

//查询用户信息接口
router.get('/sys/profile', profile)


//获取权限列表
router.get('/permission/list', getPermission)
module.exports = router
