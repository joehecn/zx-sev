
'use strict'

const jwt = require('jsonwebtoken')
const { ygSecret } = require('../zxutil.js')
const userSev = require('../service/user.js')
// const { userTypeError, userNameNotEmpty, passwordNotEmpty } = require('../err.js')

exports.login = async ctx => {
  // base64 解码
  const { user } = ctx.request.body
  // if (typeof user !== 'string') ctx.throw(401, userTypeError)

  const userStr = Buffer.from(user, 'base64').toString()
  const { userName, password } = JSON.parse(userStr)

  // if (userName === undefined) ctx.throw(401, userNameNotEmpty)
  // if (password === undefined) ctx.throw(401, passwordNotEmpty)

  const { _id, dbname } = await userSev.login(userName, password, false)
  // const dbname = CITY_DB[city]
  const token = jwt.sign({ _id, dbname }, ygSecret)

  ctx.body = token
}
