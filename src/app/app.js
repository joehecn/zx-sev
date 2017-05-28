
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const http = require('http')
const Koa = require('koa')
const socketio = require('socket.io')

const koa = new Koa()

koa.use(ctx => {
  ctx.body = 'hello'
})

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
