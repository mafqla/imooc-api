const mongoose = require('mongoose')

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

const roleSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    descibe: String,
  },
  { versionKey: false },
)

const Role = mongoose.model('Role', roleSchema, 'role')

const permissionSchema = new mongoose.Schema(
  {
    id: Number,
    permissionName: String,
    premissionMark: String,
    premissionDescr: String,
  }
)
const Permission = mongoose.model('Permission', permissionSchema, 'permission')
module.exports = {
  User,Role,Permission
}
