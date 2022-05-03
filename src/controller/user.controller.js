class UserController {
  async register(ctx, next) {
    ctx.body = '用户注册成功'
  }

  async login(ctx, next) {
    const data = {
      token: 'Bearer d8c6ed7a-3fd4-46e4-a477-b20d1ce9cda0',
    }
    ctx.body = {
      success: true,
      code: 10000,
      data,
      message: '登录成功',
    }
  }
}

module.exports = new UserController()
