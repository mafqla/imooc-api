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
  children: [
    {
      id: String,
      permissionName: String,
      permissionMark: String,
      permissionDesc: String,
    },
  ],
})
const Permission = mongoose.model(
  'Permissionl',
  permissionSchema,
  'permissionlist',
)

// 用户权限
const userPermissionSchema = new mongoose.Schema({
  _id: {
    type: [{ type: String }],
    select: false,
  },
  id: String,
  data: [{ type: String }],
})
const UserPermission = mongoose.model(
  'UserPermission',
  userPermissionSchema,
  'userpermission',
)

// feature api 接口
const featureSchema = new mongoose.Schema({
  _id: {
    type: [{ type: String }],
    select: false,
  },
  id: Number,
  title: String,
  title: String,
  percentage: Number,
  content: String,
})
const Feature = mongoose.model('Feature', featureSchema, 'feature')

// chapter api 接口
const chapterSchema = new mongoose.Schema({
  _id: {
    type: [{ type: String }],
    select: false,
  },
  id: Number,
  content: String,
  timestamp: String,
})

const Chapter = mongoose.model('Chapter', chapterSchema, 'chapter')

// 文章
const articleSchema = new mongoose.Schema({
  ranking: String,
  title: String,
  author: String,
  publicDate: String,
  desc: String,
  content: String,
})

const Article = mongoose.model('Article', articleSchema, 'article')

module.exports = {
  User,
  Role,
  Permission,
  UserPermission,
  Feature,
  Chapter,
  Article,
}
