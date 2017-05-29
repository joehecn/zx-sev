
'use strict'

const jwt = require('jsonwebtoken')
const { dengjipai } = require('../service')
const { dbNameNotEmpty, nameNotEmpty, passwordNotEmpty } = require('../err.js')

exports.login = async ctx => {
  // base64 解码
  const { user } = ctx.request.body
  const userStr = Buffer.from(user, 'base64').toString()
  const { dbName, name, password } = JSON.parse(userStr)

  if (dbName === undefined) ctx.throw(401, dbNameNotEmpty)
  if (name === undefined) ctx.throw(401, nameNotEmpty)
  if (password === undefined) ctx.throw(401, passwordNotEmpty)

  await dengjipai(dbName).checkUser(name, password)

  const token = jwt.sign({ dbName, name }, 'secret')

  ctx.set('Authorization', `Bearer ${token}`)
  ctx.status = 204
}
