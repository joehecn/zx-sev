
'use strict'

const socketio = require('socket.io')
const setYG = require('./yg.js')
const setKB = require('./kb.js')

module.exports = server => {
  const io = socketio(server)
  io.serveClient(false)

  setYG(io)
  setKB(io)
}
