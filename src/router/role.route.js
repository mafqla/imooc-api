const Router = require('koa-router')
const {
  getRole,
  getUserPermission,
  setUserRole,
  getPermission,
} = require('../controller/role.controller')

const router = new Router()

// 获取角色列表
router.get('/role/list', getRole)

// 分配角色权限
router.post('/role/distribute-permission', setUserRole)

// 获取角色权限
router.get('/role/permission/:id', getUserPermission)

//获取权限列表
router.get('/permission/list', getPermission)

module.exports = router
