const Router = require('koa-router')

const {
  register,
  login,
  profile,
  getPermission,
  getRole,
  getFeature,
  getChapter,
  getUserList,
  getUserPermission,
} = require('../controller/user.controller')

const router = new Router()

// 注册接口
router.post('/sys/register', register)

// 登录接口
router.post('/sys/login', login)

//查询用户信息接口
router.get('/sys/profile', profile)

//获取权限列表
router.get('/permission/list', getPermission)

// 获取角色列表
router.get('/role/list', getRole)

// 获取feature列表
router.get('/user/feature', getFeature)

// 获取chapter列表
router.get('/user/chapter', getChapter)

router.get('/user-manage/list', getUserList)

// 获取角色权限
router.get('/role/permission/:id', getUserPermission)
module.exports = router
