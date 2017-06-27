
'use strict'

const Router = require('koa-router')
// const koajwt = require('koa-jwt')
// const { kbSecret } = require('../zxutil.js')
const { login } = require('../controller/kb.js')

const kb = module.exports = new Router()

kb.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err)
    ctx.status = err.status || 500
    ctx.body = err.message || '999999' // 'internal server error'
  }
})

// kb.use(koajwt({ secret: kbSecret }).unless({ path: ['/api/kb/users/login'] }))
kb.post('/users/login', login)
