
'use strict'

const jwt = require('jsonwebtoken')
const { kbSecret } = require('../zxutil.js')
const userSev = require('../service/user.js')

exports.login = async ctx => {
  // base64 解码
  const { user } = ctx.request.body

  const userStr = Buffer.from(user, 'base64').toString()
  const { userName, password } = JSON.parse(userStr)

  const { _id, dbname } = await userSev.login(userName, password, true)
  // const dbName = CITY_DB[city]
  const token = jwt.sign({ _id, dbname }, kbSecret)

  ctx.body = token
}
