const jwt = require('jsonwebtoken')
const { User } = require('../model/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')

const register = async (ctx) => {
  let { username, password } = ctx.request.body
  let isDouble = false

  await User.findOne({ username }).then(async (result) => {
    if (result) isDouble = true
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
    .then(async (result) => {
      if (result) {
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
  // const isPasswordValid = bcrypt.compareSync(password, User.password)

  await User.findOne({ username, password })
    .then(async (result) => {
      if (result) {
        let token = jwt.sign(
          {
            username: result.username,
            _id: result._id,
          },
          'imooc-api',
          { expiresIn: 3600 * 24 * 7 },
        )
        ctx.body = {
          success: true,
          code: 200,
          data: {
            token: token,
          },
          message: '登录成功',
        }
      } else {
        ctx.body = {
          success: false,
          code: 300,
          message: '用户名或密码错误',
        }
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '注册异常',
        err: err.message,
      }
    })
}

/**
 * @description: 验证用户登录
 */
const verify = async (ctx) => {
  let token = ctx.header.authorization
  token = token.respace('Bearer ', '')

  try {
    let result = jwt.verify(token, 'imooc-api')
    await User.findOne({ _id: result._id })
      .then(async (result) => {
        if (result) {
          ctx.body = {
            success: true,
            code: 200,
            data: result,
            message: '用户认证成功',
          }
        } else {
          ctx.body = {
            success: false,
            code: 500,
            message: '用户认证失败',
          }
        }
      })
      .catch((err) => {
        ctx.body = {
          success: false,
          code: 500,
          message: '用户认证失败',
        }
      })
  } catch (err) {
    ctx.body = {
      success: false,
      code: 500,
      message: '用户认证失败',
    }
  }
}

//获取用户信息
const profile = async (ctx) => {
  await User.find().then((result) => {
    ctx.body = {
      success: true,
      code: 200,
      data: result,
      message: '获取用户信息成功',
    }
  })
}

module.exports = { register, login, verify, profile }
