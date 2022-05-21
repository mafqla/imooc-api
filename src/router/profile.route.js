const Router = require('koa-router')

const {
  login,
  profile,
  getFeature,
  getChapter,
} = require('../controller/profile.controller')

const router = new Router()
// 登录接口
router.post('/sys/login', login)

//查询用户信息接口
router.get('/sys/profile', profile)

// 获取feature列表
router.get('/user/feature', getFeature)

// 获取chapter列表
router.get('/user/chapter', getChapter)

module.exports = router
