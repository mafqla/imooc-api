const { User, Role } = require('../model/index')
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

// 获取用户列表
const getUserList = async (ctx) => {
  let page = parseInt(ctx.query.page)
  let size = parseInt(ctx.query.size)
  const total = await User.find().count()
  const listResult = await User.find()
    .limit(size)
    .skip((page - 1) * size)

  // console.log(listResult)
  const list = []
  for (let i in listResult) {
    const roleId = listResult[i].roleId
    const roleData = await Role.find()
    // console.log(roleData)
    const role = []
    for (let j in roleData) {
      if (roleData[j].id === roleId) {
        role.push({ id: roleData[j].id, title: roleData[j].title })
      }
    }
    list.push({
      role: role,
      _id: listResult[i]._id,
      id: listResult[i].id,
      username: listResult[i].username,
      openTime: listResult[i].openTime,
      mobile: listResult[i].mobile,
      avatar: listResult[i].avatar,
    })
  }

  ctx.body = {
    success: true,
    code: 200,
    data: {
      list: list,
      total,
      page,
      size,
    },
  }
}

// 获取所有员工列表
const getAllUserList = async (ctx) => {
  const listResult = await User.find()
  console.log(listResult)
  const role = []
  const roleId = []
  for (let i in listResult) {
    const Id = listResult[i].roleId
    // console.log(Id)
    roleId.push(Id)
  }
  for (let j in roleId) {
    const roleData = await Role.findOne({ id: roleId[j] })
    role.push({ id: roleData.id, title: roleData.title })
  }
  console.log(role)
  const list = []
  for (let i in listResult) {
    list.push({
      role: new Array(role[i]),
      _id: listResult[i]._id,
      id: listResult[i].id,
      username: listResult[i].username,
      openTime: listResult[i].openTime,
      mobile: listResult[i].mobile,
      avatar: listResult[i].avatar,
    })
  }

  ctx.body = {
    success: true,
    code: 200,
    data: {
      list: list,
    },
    message: '获取所有员工列表成功',
  }
}

module.exports = {
  register,
  getUserList,
  getAllUserList,
}
