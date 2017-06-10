
'use strict'

const Router = require('koa-router')
const yg = require('./yg.js')
const kb = require('./kb.js')
const djp = require('./djp.js')

const router = module.exports = new Router()

// 网站根目录
router.get('/', ctx => {
  ctx.body = 'server look\'s good'
})

// 阳光送机
router.use('/api/yg', yg.routes())

// 看板
router.use('/api/kb', kb.routes())

// 登机牌
router.use('/api/djp', djp.routes())
