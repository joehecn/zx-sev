
'use strict'

const http = require('http')
const Koa = require('koa')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')
const router = require('./router')
const setIO = require('./io')

const koa = new Koa()

koa
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = module.exports = http.createServer(koa.callback())

setIO(server)
