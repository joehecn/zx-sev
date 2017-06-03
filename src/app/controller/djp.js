
'use strict'

const moment = require('moment')
const jwt = require('jsonwebtoken')
const { validatorObjectId } = require('../zxutil.js')
const { dengjipai } = require('../service')
const { dbNameNotEmpty, nameNotEmpty, passwordNotEmpty,
  smDataNotEmpty, smDataNotValid, ObjectIdNotValid,
  djpNoteNotValid, isDownloadNotValid } = require('../err.js')

exports.login = async ctx => {
  // base64 解码
  const { user } = ctx.request.body
  if (typeof user !== 'string') ctx.throw(401, dbNameNotEmpty)

  const userStr = Buffer.from(user, 'base64').toString()
  const { dbName, name, password } = JSON.parse(userStr)

  if (dbName === undefined) ctx.throw(401, dbNameNotEmpty)
  if (name === undefined) ctx.throw(401, nameNotEmpty)
  if (password === undefined) ctx.throw(401, passwordNotEmpty)

  await dengjipai(dbName).checkUser(name, password)

  const token = jwt.sign({ dbName, name }, 'secret')

  ctx.body = token
  ctx.status = 200
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

exports.isdownload = async ctx => {
  const user = ctx.state.user
  const _id = ctx.params.id
  const { value } = ctx.request.body

  if (!validatorObjectId(_id)) ctx.throw(400, ObjectIdNotValid)
  if (typeof value !== 'boolean') ctx.throw(400, isDownloadNotValid)

  const res = await dengjipai(user.dbName).isdownload(_id, user.name, value)
  ctx.body = res
}

exports.isprint = async ctx => {
  const user = ctx.state.user
  const _id = ctx.params.id

  if (!validatorObjectId(_id)) ctx.throw(400, ObjectIdNotValid)

  await dengjipai(user.dbName).update({ _id, name: user.name }, { isPrint: true })
  ctx.status = 204
}

exports.djpnote = async ctx => {
  const user = ctx.state.user
  const _id = ctx.params.id
  const { value } = ctx.request.body

  if (!validatorObjectId(_id)) ctx.throw(400, ObjectIdNotValid)
  if (typeof value !== 'string') ctx.throw(400, djpNoteNotValid)

  await dengjipai(user.dbName).update({ _id, name: user.name }, { djpNote: value })
  ctx.status = 204
}
