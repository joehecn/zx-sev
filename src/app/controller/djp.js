
'use strict'

const moment = require('moment')
const jwt = require('jsonwebtoken')
const { CITY_DB, djpSecret } = require('../zxutil.js')
const getSev = require('../sev.js')
const { smDataNotValid } = require('../err.js')

// exports.getErr = ctx => {
//   ctx.body = errToClient
// }

exports.citydb = ctx => {
  ctx.body = CITY_DB
}

exports.login = async ctx => {
  // base64 解码
  const { user } = ctx.request.body

  const userStr = Buffer.from(user, 'base64').toString()
  const { dbName, name, password } = JSON.parse(userStr)

  await getSev(dbName, 'dengjipai').checkUser(name, password)

  const token = jwt.sign({ dbName, name }, djpSecret)

  ctx.body = token
}

exports.list = async ctx => {
  const { dbName, name } = ctx.state.user
  const smDate = ctx.query.smDate
  let m
  let isDate = true // 查询天还是月

  if (smDate.substr(0, 4) === '2000') {
    // 彩蛋 查询整月
    if (Number(smDate.substr(8, 2)) > 12) {
      ctx.throw(400, smDataNotValid)
    }

    m = moment(`201${smDate.substr(6, 4)}-01`)
    isDate = false
  } else {
    m = moment(smDate)
  }

  const res = await getSev(dbName, 'dengjipai').list(name, m, isDate)
  ctx.body = res
}

exports.isdownload = async ctx => {
  const { dbName, name } = ctx.state.user
  const _id = ctx.params.id
  const { value } = ctx.request.body

  const res = await getSev(dbName, 'dengjipai').isdownload(_id, name, value)
  ctx.body = res
}

exports.isprint = async ctx => {
  const { dbName, name } = ctx.state.user
  const _id = ctx.params.id
  const { value } = ctx.request.body

  await getSev(dbName, 'dengjipai').update({ _id, name }, { isPrint: value })
  ctx.status = 204
}

exports.djpnote = async ctx => {
  const { dbName, name } = ctx.state.user
  const _id = ctx.params.id
  const { value } = ctx.request.body

  await getSev(dbName, 'dengjipai').update({ _id, name }, { djpNote: value })
  ctx.status = 204
}
