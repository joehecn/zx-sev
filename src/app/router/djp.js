
'use strict'

const Router = require('koa-router')
const koajwt = require('koa-jwt')
const { login, list } = require('../controller/djp.js')

const djp = module.exports = new Router()

djp.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // console.log(err)
    ctx.status = err.status || 500
    ctx.body = err.message || 'internal server error'
  }
})

djp.use(koajwt({ secret: 'secret' }).unless({ path: ['/api/djp/users/login'] }))
djp.post('/users/login', login)

djp.get('/djps', list)
