const { Role, Permission, UserPermission } = require('../model/index')

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

// 分配用户角色权限
const setUserRole = async (ctx) => {
  const { roleId, permissions } = ctx.request.body
  // console.log(roleId, permissions)
  if (roleId === '1' || roleId === '2') {
    return (ctx.body = {
      success: false,
      code: 200,
      message: '[超级管理员、管理员]角色不能被修改！',
    })
  }

  await UserPermission.updateOne({ id: roleId }, { data: permissions })
    .then(async (result) => {
      // console.log(result)
      ctx.body = {
        success: true,
        code: 200,
        data: null,
        message: '分配用户角色权限成功！',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '分配用户角色权限失败！',
        err: err.message,
      }
    })
}
// 获取指定用户的权限
const getUserPermission = async (ctx) => {
  const { id } = ctx.params
  await UserPermission.findOne({ id })
    .then(async (userPermission) => {
      ctx.body = {
        success: true,
        code: 200,
        data: userPermission.data,
        message: '获取指定用户的权限成功！',
      }
    })
    .catch((err) => {
      ctx.body = {
        success: false,
        code: 500,
        message: '获取指定用户的权限失败！',
        err: err.message,
      }
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

module.exports = {
  getPermission,
  getRole,
  getUserPermission,
  setUserRole,
}
