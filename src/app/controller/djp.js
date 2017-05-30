
'use strict'

const moment = require('moment')
const jwt = require('jsonwebtoken')
const { dengjipai } = require('../service')
const { dbNameNotEmpty, nameNotEmpty, passwordNotEmpty,
  smDataNotEmpty, smDataNotValid } = require('../err.js')

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

exports.list = async ctx => {
  const user = ctx.state.user
  const smDate = ctx.query.smDate
  let m
  let isDate = true // 查询天还是月

  if (!smDate) ctx.throw(400, smDataNotEmpty)

  if (smDate.substr(0, 4) === '2000') {
    // 彩蛋 查询整月
    if (!(Number(smDate.substr(8, 2)) > 0 && Number(smDate.substr(8, 2)) < 13)) {
      ctx.throw(400, smDataNotValid)
    }

    m = moment(`201${smDate.substr(6, 4)}-01`)
    isDate = false
  } else {
    m = moment(smDate)
    if (!m.isValid()) ctx.throw(400, smDataNotValid)
  }

  const res = await dengjipai(user.dbName).list(user.name, m, isDate)
  ctx.body = res
}
