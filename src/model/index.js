const mongoose = require('mongoose')

// 用户信息
const userSchema = new mongoose.Schema(
  {
    id: String,
    roleId: Number,
    openTime: String,
    username: String,
    password: {
      type: String,
    },
    mobile: String,
    avatar: String,
  },
  { versionKey: false },
)
const User = mongoose.model('Userinfo', userSchema, 'userinfo')

// 角色列表
const roleSchema = new mongoose.Schema(
  {
    _id: {
      type: [{ type: String }],
      select: false,
    },
    id: Number,
    title: String,
    describe: String,
  },
  { versionKey: false },
)

const Role = mongoose.model('Role', roleSchema, 'role')

// 权限列表
const permissionSchema = new mongoose.Schema({
  _id: {
    type: [{ type: String }],
    select: false,
  },
  id: String,
  permissionName: String,
  permissionMark: String,
  permissionDesc: String,
})
const Permission = mongoose.model('Permissionl', permissionSchema, 'permissionlist')

// 用户权限
const userPermissionSchema = new mongoose.Schema({
  _id: {
    type: [{ type: String }],
    select: false,
  },
  id: Number,
  data: [{ type: String }],
})
const UserPermission = mongoose.model(
  'UserPermission',
  userPermissionSchema,
  'userpermission',
)




module.exports = {
  User,
  Role,
  Permission,
  UserPermission,
}
