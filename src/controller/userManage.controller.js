const { User, Role, Manage } = require('../model/index')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

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
  const role = new Map()
  const roleId = []
  for (let i in listResult) {
    const Id = listResult[i].roleId
    // console.log(Id)
    roleId.push(Id)
  }
  // console.log(roleId)
  for (let j in roleId) {
    // console.log(roleId[j])
    const data = []
    for (let k in roleId[j]) {
      const roleData = await Role.findOne({ id: roleId[j][k] })
      data.push({ id: roleData.id, title: roleData.title })
    }
    // console.log(data)
    role.set(j, data)
  }
  // console.log(role)

  const list = []
  for (let i in listResult) {
    list.push({
      role: role.get(i),
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
  // console.log(listResult)
  const role = new Map()
  const roleId = []
  for (let i in listResult) {
    const Id = listResult[i].roleId
    // console.log(Id)
    roleId.push(Id)
  }
  // console.log(roleId)
  for (let j in roleId) {
    // console.log(roleId[j])
    const data = []
    for (let k in roleId[j]) {
      const roleData = await Role.findOne({ id: roleId[j][k] })
      data.push({ id: roleData.id, title: roleData.title })
    }
    // console.log(data)
    role.set(j, data)
  }
  // console.log(role)

  const list = []
  for (let i in listResult) {
    list.push({
      role: role.get(i),
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

// 获取指定员工当前角色
const getUserRole = async (ctx) => {
  const { id } = ctx.params
  const OId = mongoose.Types.ObjectId(id)
  const roleIdlist = await User.findOne({ _id: OId })
  const role = []
  for (let i in roleIdlist.roleId) {
    const roleData = await Role.findOne({ id: roleIdlist.roleId[i] })
    role.push(roleData)
  }
  // console.log(role)
  ctx.body = {
    success: true,
    code: 200,
    data: {
      role: role,
    },
    message: '获取指定员工当前角色成功',
  }
}

// 更新用户角色
const updateUserRole = async (ctx) => {
  const { userId } = ctx.request.params
  const roles = ctx.request.body.roles
  const OId = mongoose.Types.ObjectId(userId)
  const role = []
  for (let i in roles) {
    role.push(roles[i].id)
  }

  for (let i in role) {
    if (role[i] === '1' || role[i] === '2') {
      return (ctx.body = {
        success: false,
        code: 200,
        message: '[超级管理员、管理员]角色不能被修改！',
      })
    }
  }

  await User.updateOne({ _id: OId }, { $set: { roleId: role } })
    .then(async (result) => {
      ctx.body = {
        success: true,
        code: 200,
        data: role,
        message: '更新用户角色成功',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '更新用户角色失败',
        err: err.message,
      }
    })
}

// 获取指定员工信息
const getUserInfoById = async (ctx) => {
  const { id } = ctx.params
  const OId = mongoose.Types.ObjectId(id)
  const userInfo = await User.findOne({ _id: OId })
  const role = []
  const roleData = await Role.findOne({ id: userInfo.roleId })
  role.push({ id: roleData.id, title: roleData.title })
  const manageinfo = await Manage.findOne({ id: userInfo.id })
  if (userInfo) {
    ctx.body = {
      success: true,
      code: 200,
      data: {
        role: role,
        remark: manageinfo.remark,
        experience: manageinfo.experience,
        _id: userInfo._id,
        id: userInfo.id,
        openTime: userInfo.openTime,
        username: userInfo.username,
        title: roleData.title,
        mobile: userInfo.mobile,
        avatar: userInfo.avatar,
        gender: manageinfo.gender,
        nationality: manageinfo.nationality,
        address: manageinfo.address,
        major: manageinfo.major,
        glory: manageinfo.glory,
      },
      message: '获取指定员工信息成功',
    }
  } else {
    ctx.body = {
      success: false,
      code: 500,
      message: '获取指定员工信息失败',
    }
  }
}

// 添加员工(通过excel导入)
const addUserByExcel = async (ctx) => {
  const body = ctx.request.body
  // console.log(body)
  for (let i in body) {
    const roleId = []
    const result = await Role.findOne({ title: body[i].role })
    roleId.push(result.id)
    // console.log(roleId)
    const user = new User({
      id: body[i].id,
      roleId: roleId,
      username: body[i].username,
      password: body[i].password,
      openTime: Date.parse(body[i].openTime),
      mobile: body[i].mobile,
      avatar: body[i].avatar,
    })

    // console.log(user)
    await user.save().then(async (result) => {
      const manage = new Manage({
        id: result.id,
      })
      await manage.save().then(async (result) => {

        ctx.body = {
          success: true,
          code: 200,
          data: null,
          message: '添加员工成功',
        }
      })
    })
  }
}

// 删除员工
const deleteUser = async (ctx) => {
  const { id } = ctx.params
  // console.log(id)
  const OId = mongoose.Types.ObjectId(id)
  const userRoleId = await User.findOne({ _id: OId }).select('roleId')
  // console.log(userRoleId)

  if (userRoleId.roleId.includes('1') || userRoleId.roleId.includes('2')) {
    return (ctx.body = {
      success: false,
      code: 200,
      message: '超级管理员、管理员角色不能被删除！',
    })
  }

  await User.deleteOne({ _id: OId })
    .then(async (result) => {
      ctx.body = {
        success: true,
        code: 200,
        data: null,
        message: '删除员工成功',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '删除员工失败',
        err: err.message,
      }
    })
}
module.exports = {
  register,
  getUserList,
  getAllUserList,
  getUserRole,
  updateUserRole,
  getUserInfoById,
  addUserByExcel,
  deleteUser,
}
