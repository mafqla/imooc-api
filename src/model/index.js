const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  password: {
    type: String,
    select: false,
  },
})
const User = mongoose.model('User', userSchema)

module.exports = {
  User,
}
