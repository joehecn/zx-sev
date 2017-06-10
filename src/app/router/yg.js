
'use strict'

const Router = require('koa-router')
// const koajwt = require('koa-jwt')
// const { ygSecret } = require('../zxutil.js')
const { login } = require('../controller/yg.js')

const yg = module.exports = new Router()

yg.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // console.log(err)
    ctx.status = err.status || 500
    ctx.body = err.message || '999999' // 'internal server error'
  }
})

// yg.use(koajwt({ secret: ygSecret }).unless({ path: ['/api/yg/users/login'] }))
yg.post('/users/login', login)
