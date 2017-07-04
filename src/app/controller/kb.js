
'use strict'

const jwt = require('jsonwebtoken')
const { kbSecret, CITY_PLACES } = require('../zxutil.js')
const userSev = require('../service/user.js')

exports.login = async ctx => {
  console.log(ctx.request.body)
  // base64 解码
  const { user } = ctx.request.body

  const userStr = Buffer.from(user, 'base64').toString()
  const { userName, password } = JSON.parse(userStr)

  console.log(userName, password)

  const { _id, name, city, dbname } = await userSev.login(userName, password, true)

  const token = jwt.sign({ _id, dbname }, kbSecret)

  const places = CITY_PLACES[city]

  ctx.body = { token, name, city, places }
}
