
'use strict'

const Router = require('koa-router')
const djp = require('./djp.js')

const router = module.exports = new Router()

// 网站根目录
router.get('/', ctx => {
  ctx.body = 'server look\'s good'
})

// 登机牌
router.use('/api/djp', djp.routes())
