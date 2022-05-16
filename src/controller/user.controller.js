const jwt = require('jsonwebtoken')
const { User, Role,Permission } = require('../model/index')
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
        message: '注册出现异常',
        err: err.message,
      }
    })
}

const login = async (ctx) => {
  const { username, password } = ctx.request.body

  await User.findOne({ username })
    .then(async (result) => {
      if (!result) {
        ctx.body = {
          success: false,
          code: 300,
          message: '用户不存在',
        }
      } else {
        console.log(result.username)
        // 密码验证
        const isPasswordValid = bcrypt.compareSync(password, result.password)
        // console.log(isPasswordValid)
        if (isPasswordValid) {
          const token = jwt.sign(
            { username: result.username, id: result.id },
            'imooc-api',
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
            message: '密码错误',
          }
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

//获取用户信息
const profile = async (ctx) => {
  await User.findOne().then(async (result) => {
    // console.log(result)
    const roleId = result.roleId
    await Role.findOne({ roleId }).then(async (role) => {
      ctx.body = {
        success: true,
        code: 200,
        data: {
          role: {
            id: role.id,
            title: role.title,
          },
          _id: result._id,
          id: result.id,
          username: result.username,
          title: role.title,
          avtar: result.avatar,
          // permission,
        },
        message: '获取用户信息成功！',
      }
    })
  })
}

// 获取权限列表
const getPermission = async (ctx) => {  
  await Permission.find().then(async (permission) => {
    // console.log(permission)
    const data = permission
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取权限列表成功！',
    }
  })
}

// 获取角色列表
const getRole = async (ctx) => {
  await Role.find().then(async (role) => {
    // console.log(role)
    const data = role
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取角色列表成功！',
    }
  })
}


module.exports = { register, login, profile, getPermission, getRole }
