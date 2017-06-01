
'use strict'

const getData = data => {
  return Promise.resolve(data)
}

const http = require('http')
const Koa = require('koa')
const cors = require('kcors')
const bodyParser = require('koa-bodyparser')
const socketio = require('socket.io')

const router = require('./router')

const koa = new Koa()

koa
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = module.exports = http.createServer(koa.callback())

const io = socketio(server)
io.serveClient(false)

io.on('connection', socket => {
  socket.on('event', async (data, cb) => {
    const _data = await getData(data)
    cb(_data)
  })
})
