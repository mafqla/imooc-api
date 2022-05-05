const jwt = require('jsonwebtoken')
const { User } = require('../model/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')

const register = async ctx => {
  let { username, password } = ctx.request.body
  let isDouble = false

  await User.findOne({ username }).then(async (rel) => {
    if (rel) isDouble = true
  })
  if (isDouble) {
    ctx.body = {
      code: 300,
      message: '用户名已存在',
    }
    return
  }
  password = bcrypt.hashSync(password, 10)
  await User.create({ username, password })
    .then(async (rel) => {
      if (rel) {
        ctx.body = {
          success: true,
          code: 200,
          message: '注册成功',
        }
      } else {
        ctx.body = {
          success: false,
          code: 300,
          message: '注册失败',
        }
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '登录出现异常',
        err: err.message,
      }
    })
}
const login = async (ctx) => {
  let { username, password } = ctx.request.body
  await User.findOne({ username, password })
    .then(async (rel) => {
      if (rel) {
        let token = jwt.sign(
          {
            username: rel.username,
            _id: rel._id,
          },
          'secret',
          { expiresIn: 3600 * 24 * 7 },
        )
        ctx.body = {
          success: true,
          code: 200,
          data: token,
          message: '登录成功',
        }
      } else {
        ctx.body = {
          success: false,
          code: 300,
          message: '登录失败',
        }
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '登录出现异常',
        err: err.message,
      }
    })
}
module.exports = { register, login }
