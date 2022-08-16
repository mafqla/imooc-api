const jwt = require('jsonwebtoken')
// 导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
const {
  User,
  Role,
  Permission,
  UserPermission,
  Feature,
  Chapter
} = require('../model/index')

const login = async ctx => {
  const { username, password } = ctx.request.body

  await User.findOne({ username })
    .then(async result => {
      if (!result) {
        ctx.body = {
          success: false,
          code: 300,
          message: '用户不存在'
        }
      } else {
        // console.log(result.username)
        // 密码验证
        const isPasswordValid = bcrypt.compareSync(password, result.password)
        // console.log(isPasswordValid)
        if (isPasswordValid) {
          const token = jwt.sign(
            { username: result.username, id: result.id },
            'imooc-api'
          )
          ctx.body = {
            success: true,
            code: 200,
            data: {
              token: token
            },
            message: '登录成功'
          }
        } else {
          ctx.body = {
            success: false,
            code: 300,
            message: '密码错误'
          }
        }
      }
    })
    .catch(err => {
      ctx.body = {
        success: false,
        code: 500,
        message: '登录出现异常',
        err: err.message
      }
    })
}

//获取用户信息
const profile = async ctx => {
  //从token中获取用户id
  const { id } = ctx.state.user
  await User.findOne({ id }).then(async result => {
    const roleIdArr = result.roleId
    // 获取数组中的值并返回
    const roleId = roleIdArr[0]
    await Role.findOne({id: roleId }).then(async role => {
      // console.log(role)
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
            title: role.title
          },
          _id: result._id,
          id: result.id,
          username: result.username,
          title: role.title,
          avatar: result.avatar,
          permission: {
            menus,
            points
          }
        },
        message: '获取用户信息成功！'
      }
    })
  })
}

// 获取feature列表
const getFeature = async ctx => {
  await Feature.find().then(async feature => {
    // console.log(feature)
    const data = feature
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取feature列表成功！'
    }
  })
}

// 获取chapter列表
const getChapter = async ctx => {
  await Chapter.find().then(async chapter => {
    // console.log(chapter)
    const data = chapter
    ctx.body = {
      success: true,
      code: 200,
      data,
      message: '获取chapter列表成功！'
    }
  })
}

module.exports = {
  login,
  profile,
  getFeature,
  getChapter
}
