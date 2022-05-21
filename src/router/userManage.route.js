const Router = require('koa-router')

const { register, getUserList } = require('../controller/userManage.controller')

const router = new Router()

// 注册接口
router.post('/sys/register', register)

// 获取员工列表
router.get('/user-manage/list', getUserList)

module.exports = router
