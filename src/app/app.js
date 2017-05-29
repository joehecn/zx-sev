
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const http = require('http')
const Koa = require('koa')
const Router = require('koa-router')
const socketio = require('socket.io')

const koa = new Koa()
const router = new Router()

router.get('/', function (ctx) {
  ctx.body = 'hello'
})

koa
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(koa.callback())

const io = socketio(server)
io.serveClient(false)

io.on('connection', socket => {
  socket.on('event', async (data, cb) => {
    const _data = await getData(data)
    cb(_data)
  })
})

module.exports = {
  server
}
