const Router = require('koa-router')

const {
  register,
  getUserList,
  getAllUserList,
  getUserRole,
  updateUserRole,
  getUserInfoById,
  addUserByExcel,
  deleteUser,
} = require('../controller/userManage.controller')

const router = new Router()

// 注册接口
router.post('/sys/register', register)

// 获取员工列表
router.get('/user-manage/list', getUserList)

// 获取所有员工列表
router.get('/user-manage/all-list', getAllUserList)

// 获取指定员工当前角色
router.get('/user-manage/role/:id', getUserRole)

// 更新用户角色
router.post('/user-manage/update-role/:userId', updateUserRole)

// 获取指定员工信息
router.get('/user-manage/detail/:id', getUserInfoById)

// 增加员工
router.post('/user-manage/batch/import', addUserByExcel)

// 删除员工
router.get('/user-manage/detele/:id', deleteUser)

module.exports = router
