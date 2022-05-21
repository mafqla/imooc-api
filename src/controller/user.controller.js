const jwt = require('jsonwebtoken')
const {
  User,
  Role,
  Permission,
  UserPermission,
  Feature,
  Chapter,
} = require('../model/index')
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
      const userPermission = await UserPermission.findOne({ id: role.id })
      let permissionid = userPermission.data
      // console.log(permissionid)
      let pointsid = []
      let menusid = []
      for (let i in permissionid) {
        // console.log(permissionid[i])
        let test = /[1-9]-[1-9]/.test(permissionid[i])
        // console.log(test)
        if (test) {
          pointsid.push(permissionid[i])
        } else {
          menusid.push(permissionid[i])
        }
      }
      // console.log(pointsid)
      const pointsData = await Permission.find().select('children')
      // console.log(pointsData[0].children)
      const pointslist = []
      for (let i in pointsid) {

        for (let j in pointsData[i].children) {
          pointslist.push(pointsData[i].children[j])
        }
      }
      // console.log(pointslist)

      const permission = await Permission.find({ id: menusid })

      let points = []
      let menus = []

      for (let i in pointslist) {
        points.push(pointslist[i].permissionMark)
      }
      // console.log(points)
      for (let i in permission) {
        menus.push(permission[i].permissionMark)
      }
      // console.log("points:",points,"menus:",menus)

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
          avatar: result.avatar,
          permission: {
            menus,
            points,
          },
        },
        message: '获取用户信息成功！',
      }
    })
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

// 获取feature列表
const getFeature = async (ctx) => {
  await Feature.find().then(async (feature) => {
    // console.log(feature)
    const data = feature
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取feature列表成功！',
    }
  })
}

// 获取chapter列表
const getChapter = async (ctx) => {
  await Chapter.find().then(async (chapter) => {
    // console.log(chapter)
    const data = chapter
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取chapter列表成功！',
    }
  })
}

module.exports = {
  register,
  login,
  profile,
  getPermission,
  getRole,
  getFeature,
  getChapter,
  getUserList,
  getUserPermission,
}
